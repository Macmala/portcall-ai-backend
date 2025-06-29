/**
 * Cache intelligent pour PortCall AI v3
 * Réduit drastiquement les temps de génération pour les ports fréquents
 */

const fs = require('fs').promises;
const path = require('path');

class PortCache {
    constructor() {
        this.cacheDir = path.join(__dirname, 'cache_data');
        this.maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes
        this.ensureCacheDir();
    }

    async ensureCacheDir() {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            console.log('Cache directory already exists or created');
        }
    }

    /**
     * Génère une clé de cache basée sur les paramètres de requête
     */
    generateCacheKey(port, activityType, yachtFlag) {
        // Normaliser pour éviter la sensibilité à la casse
        const normalizedPort = port.toLowerCase().trim();
        const normalizedActivity = activityType.toLowerCase();
        const normalizedFlag = yachtFlag.toLowerCase();
        
        return `${normalizedPort}_${normalizedActivity}_${normalizedFlag}`;
    }

    /**
     * Récupère les données du cache si elles existent et sont valides
     */
    async getCachedResult(port, activityType, yachtFlag) {
        try {
            const cacheKey = this.generateCacheKey(port, activityType, yachtFlag);
            const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
            
            const cacheData = await fs.readFile(cacheFile, 'utf8');
            const parsedData = JSON.parse(cacheData);
            
            // Vérifier l'âge du cache
            const cacheAge = Date.now() - parsedData.timestamp;
            if (cacheAge > this.maxCacheAge) {
                console.log(`Cache expired for ${cacheKey}, age: ${Math.round(cacheAge / (1000 * 60 * 60))}h`);
                await this.deleteCacheEntry(cacheKey);
                return null;
            }
            
            console.log(`🚀 CACHE HIT for ${cacheKey} (${Math.round(cacheAge / (1000 * 60 * 60))}h old)`);
            
            // Mettre à jour les métadonnées avec l'heure actuelle
            parsedData.result.metadata.generated_at = new Date().toISOString();
            parsedData.result.metadata.cache_used = true;
            parsedData.result.metadata.cache_age_hours = Math.round(cacheAge / (1000 * 60 * 60));
            
            return parsedData.result;
            
        } catch (error) {
            // Cache miss ou erreur de lecture
            return null;
        }
    }

    /**
     * Stocke un résultat dans le cache
     */
    async setCachedResult(port, activityType, yachtFlag, result) {
        try {
            const cacheKey = this.generateCacheKey(port, activityType, yachtFlag);
            const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
            
            const cacheData = {
                port,
                activityType, 
                yachtFlag,
                timestamp: Date.now(),
                result: result
            };
            
            await fs.writeFile(cacheFile, JSON.stringify(cacheData, null, 2));
            console.log(`💾 CACHE STORED for ${cacheKey}`);
            
        } catch (error) {
            console.error('Error storing cache:', error.message);
        }
    }

    /**
     * Supprime une entrée de cache
     */
    async deleteCacheEntry(cacheKey) {
        try {
            const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
            await fs.unlink(cacheFile);
        } catch (error) {
            // Fichier n'existe pas, ignore
        }
    }

    /**
     * Nettoie le cache des entrées expirées
     */
    async cleanExpiredCache() {
        try {
            const files = await fs.readdir(this.cacheDir);
            let cleanedCount = 0;
            
            for (const file of files) {
                if (!file.endsWith('.json')) continue;
                
                const filePath = path.join(this.cacheDir, file);
                const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
                
                const age = Date.now() - data.timestamp;
                if (age > this.maxCacheAge) {
                    await fs.unlink(filePath);
                    cleanedCount++;
                }
            }
            
            if (cleanedCount > 0) {
                console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
            }
            
        } catch (error) {
            console.error('Error cleaning cache:', error.message);
        }
    }

    /**
     * Statistiques du cache
     */
    async getCacheStats() {
        try {
            const files = await fs.readdir(this.cacheDir);
            const cacheFiles = files.filter(f => f.endsWith('.json'));
            
            const stats = {
                totalEntries: cacheFiles.length,
                validEntries: 0,
                expiredEntries: 0,
                totalSizeKB: 0
            };
            
            for (const file of cacheFiles) {
                const filePath = path.join(this.cacheDir, file);
                const stat = await fs.stat(filePath);
                stats.totalSizeKB += stat.size / 1024;
                
                try {
                    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
                    const age = Date.now() - data.timestamp;
                    
                    if (age > this.maxCacheAge) {
                        stats.expiredEntries++;
                    } else {
                        stats.validEntries++;
                    }
                } catch (e) {
                    stats.expiredEntries++;
                }
            }
            
            return stats;
            
        } catch (error) {
            return { error: error.message };
        }
    }
}

module.exports = PortCache;