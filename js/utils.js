export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function highlightPoints(canvas, point) {
    // console.log(canvas, point);
    const ctx = canvas.getContext("2d");
    const radius = 10;
    const { x, y } = point;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}

export function pushValues(start, end) {
    let tempArray = [];
    if (start < end) {
        for (let i = start; i <= end; i++) {
            tempArray.push(i);
        }
    } else if (start > end) {
        for (let i = start; i >= end; i--) {
            tempArray.push(i);
        }
    }
    return tempArray;
}

export function distanceBetweenPoints(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
}
