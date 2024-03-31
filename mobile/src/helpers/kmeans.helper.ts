type Point = number[];
type Cluster = Point[];

function calculateDistance(point1: Point, point2: Point): number {
    return Math.sqrt(point1.reduce((sum, current, i) => sum + Math.pow(current - point2[i], 2), 0));
}

function assignPointsToClusters(points: Point[], centroids: Point[]): Cluster[] {
    const clusters: Cluster[] = centroids?.map(() => []);
    points.forEach(point => {
        let minDistance = Infinity;
        let closestCentroidIndex = 0;
        centroids.forEach((centroid, index) => {
            const distance = calculateDistance(point, centroid);
            if (distance < minDistance) {
                minDistance = distance;
                closestCentroidIndex = index;
            }
        });
        clusters[closestCentroidIndex].push(point);
    });
    return clusters;
}

function updateCentroids(clusters: Cluster[]): Point[] {
    return clusters?.map(cluster =>{
        return cluster[0]?.map((_, i) =>
            cluster.reduce((sum, point) => sum + point[i], 0) / cluster.length
        ) ?? []
    }
    );
}

interface Kmeans {
    centroids: Point[]
    clusters: Cluster[]
}
function kmeans(points: Point[], k: number, maxIterations: number = 100): Kmeans {
    let centroids: Point[] = points.slice(0, k); // Simple initialization, should be improved
    let clusters: Cluster[] = []
    for (let i = 0; i < maxIterations; i++) {
        clusters = assignPointsToClusters(points, centroids);
        const newCentroids = updateCentroids(clusters);
        if (newCentroids.every((nc, index) => calculateDistance(nc, centroids[index]) < 0.0001)) {
            break;
        }
        centroids = newCentroids;
    }
    return { centroids, clusters };
}



function averageCentroidDistance(centroids1: Point[], centroids2: Point[]): number {
    const distances = centroids1.map((centroid, i) => calculateDistance(centroid, centroids2[i]));
    const averageDistance = distances.reduce((sum, distance) => sum + distance, 0) / distances.length;
    return averageDistance;
}

export function getKmeansDistance(kmeans1: Kmeans, kmeans2: Kmeans): number {
    return averageCentroidDistance(kmeans1.centroids, kmeans2.centroids)
}


export default kmeans