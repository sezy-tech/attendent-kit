
export function calculateEuclideanDistance(landmarks1: number[][], landmarks2: number[][]): number {
    // Check if both sets of landmarks have the same length
    if (landmarks1.length !== landmarks2.length) {
        return 10
        // throw new Error('Landmarks arrays must be of the same length.');
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


export function verifyLandmark(saveLandmarks: number[][][], inputLandmark: number[][]) {
    for (const savedLandmark of saveLandmarks) {
        const distance = calculateEuclideanDistance(inputLandmark, savedLandmark)
        if (distance < 2) {
            return true
        }
    }
    return false
}
export function verifyFacePath(savedFacePaths: string[], facePath: string) {
  for(const savedFacePath of savedFacePaths) {
    //call api return true or false
    const rsp = true
    if(rsp) {
      return true
    }else {
      return false
    }   
    
  }
}