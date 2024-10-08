import { Face, LandmarkType, Point } from "@react-native-ml-kit/face-detection";


export function calculatePointDistance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return Math.sqrt(dx * dx + dy * dy);
}

function calculateDistance(lm1: LandmarkType, lm2: LandmarkType) {

    // Object.keys(lm1).reduce((lm, key) => {
    //     lm[]
    //     return lm
    // }, {} as LandmarkType)
    // return Math.sqrt(point1.reduce((sum, current, i) => sum + Math.pow(current - point2[i], 2), 0));

}


export function calculateAvgDistance(d1: number[], d2: number[]) {
    const sum = d1.reduce((sum, n1, index) => {
        sum += Math.abs(n1 - d2[index])
        return sum
    }, 0)
    return sum / d1.length
}
function calculateEuclideanDistance(landmarks1: number[][], landmarks2: number[][]): number {
    // Check if both sets of landmarks have the same length
    if (landmarks1.length !== landmarks2.length) {
        throw new Error('Landmarks arrays must be of the same length.');
    }

    let sumOfSquares = 0;

    // Loop through each pair of landmarks
    for (let i = 0; i < landmarks1.length; i++) {
        let distanceSquared = 0;

        // Calculate the squared distance for each dimension
        for (let j = 0; j < landmarks1[i].length; j++) {
            let difference = landmarks1[i][j] - landmarks2[i][j];
            distanceSquared += difference * difference;
        }

        // Add the square root of the squared distances to the sum
        sumOfSquares += Math.sqrt(distanceSquared);
    }

    // Return the average Euclidean distance
    return sumOfSquares / landmarks1.length;
}


const faceLandmark = {
    calculateDistance,
    calculateEuclideanDistance,
}


export default faceLandmark