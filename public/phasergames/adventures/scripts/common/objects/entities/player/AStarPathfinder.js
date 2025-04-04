 class AStar {
    ADJACENT_CANDIDATES_4WAY_MINI = [
        {
            "x":0,
            "y":-1,
            "z":0,
            "cost":10
        },{
            "x":0,
            "y":1,
            "z":0,
            "cost":10
        },{
            "x":-1,
            "y":0,
            "z":0,
            "cost":10
        },{
            "x":1,
            "y":0,
            "z":0,
            "cost":10
        }];
    
    width;
    adjacentCandidates;
    spaces;
    height;
      
    /**
     * 
     * @param {*} mapData Should be this.phaserScene.tiles in most cases
     * @param {*} isWalkable Function to check if tile is walkable 
     */
    constructor(mapData) {
        // this.isWalkableFunction = isWalkable;
        this.mapData = mapData
        this.width = Object.keys(mapData[0][0]).length;
        this.height = Object.keys(mapData[0]).length;
        this.spaces = Array.from({ length: this.width }, () => new Array(this.height).fill(null));
        this.resetSpaces()
        this.adjacentCandidates = this.ADJACENT_CANDIDATES_4WAY_MINI;
    }
    
    /**
     * Get next space if it is valid
     * @param {number} x 
     * @param {number} y 
     * @returns The space if it exists, null if it does not
     */
    TryGetSpace(x, y) {
        if(x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.spaces[x][y];
        }
        return null;
    }

    /**
     * Checks if the given space is walkable
     * @param {*} x 
     * @param {*} y 
     * @returns If the space is available or not
     */
    isWalkable(x, y) {
        let test = this.spaces[x][y].walkable !== "false" ? true : false
        return test
    }
      
    /**
     * Resets the array of spaces
     */
    resetSpaces() {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.spaces[x][y] = {}
                this.spaces[x][y].name = this.mapData[y][x].data.id
                this.spaces[x][y].walkable = this.mapData[y][x].data.walkable
                this.spaces[x][y].F = 0
                this.spaces[x][y].G = 0
                this.spaces[x][y].ParentX = null
                this.spaces[x][y].ParentY = null
                this.spaces[x][y].IsOpen = false
                this.spaces[x][y].IsClosed = false
            }
        }
    }
     
    /**
     * Calculates the best path from the start position to the target
     * @param {*} startX 
     * @param {*} startY 
     * @param {*} targetX 
     * @param {*} targetY 
     * @returns 
     */
    Calculate(startX, startY, targetX, targetY) {
        let radius = 0
        let path = null;
        let nextOpenX = 0;
        let nextOpenY = 0;
        let maxIntTest = 0;
        let testComplete = false;
        let testSpace = null;
        let nextOpenSpace = null;
        if(targetX >= 0 && targetX < this.width && targetY >= 0 && targetY < this.height) {
            if(radius > 0 || radius == 0 && this.isWalkable(targetX,targetY))
            {
                this.resetSpaces();
                this.spaces[startX][startY].IsOpen = true;
                testComplete = false;
                while(!testComplete){
                    maxIntTest = Number.MAX_SAFE_INTEGER;
                    for (var testX = 0; testX < this.width; testX++) {
                        for (var testY = 0; testY < this.height; testY++) {
                            testSpace = this.spaces[testX][testY];
                            if(testSpace.IsOpen && !testSpace.IsClosed && testSpace.F < maxIntTest) {
                                nextOpenX = testX;
                                nextOpenY = testY;
                                maxIntTest = testSpace.F;
                            }
                        }
                    }
                    
                    if(maxIntTest === Number.MAX_SAFE_INTEGER) {
                        testComplete = true;
                    }
                    else if(Math.abs(nextOpenX - targetX) <= radius && Math.abs(nextOpenY - targetY) <= radius) {
                        testComplete = true;
                        path = this.GeneratePath(startX,startY,nextOpenX,nextOpenY);
                    }
                    else {
                        nextOpenSpace = this.spaces[nextOpenX][nextOpenY];
                        nextOpenSpace.IsClosed = true;
                        this.TryOpenAdjacent(nextOpenSpace,nextOpenX,nextOpenY,targetX,targetY);
                    }
                }
            }
        }
        return path;
    }
    
    /**
     * Generates the final path
     * @param {*} startX 
     * @param {*} startY 
     * @param {*} nextOpenX 
     * @param {*} nextOpenY 
     * @returns 
     */
    GeneratePath(startX, startY, nextOpenX, nextOpenY) {
        let nextSpace = null;
        let path = new Array();
        let nextX = nextOpenX;
        let nextY = nextOpenY;
        while(nextX != startX || nextY != startY)
        {
            path.push({x: nextX, y: nextY});
            nextSpace = this.spaces[nextX][nextY];
            nextX = nextSpace.ParentX;
            nextY = nextSpace.ParentY;
        }
        path.reverse();
        return path;
    }
      
    /**
     * Check adjacent spaces and update their path weights (see if old best path or current path is the best way to get there)
     * @param {*} nextOpenSpace 
     * @param {*} nextOpenX 
     * @param {*} nextOpenY 
     * @param {*} targetX 
     * @param {*} targetY 
     */
    TryOpenAdjacent(nextOpenSpace, nextOpenX, nextOpenY, targetX, targetY) {
        let candidateIndex = 0;
        let candidate = null;
        let newX = 0;
        let newY = 0;
        let candidatePenalty = 0;
        let nextSpace = null;
        while(candidateIndex < this.adjacentCandidates.length)
        {
            candidate = this.adjacentCandidates[candidateIndex];
            newX = nextOpenX + candidate.x;
            newY = nextOpenY + candidate.y;
            candidatePenalty = parseInt(candidate.cost);
            nextSpace = this.TryGetSpace(newX,newY);
            if(nextSpace != null && nextSpace.walkable && !nextSpace.IsClosed && this.isWalkable(newX,newY)) { // && IsConnected(param1,nextSpace,_loc9_.x,_loc9_.y,_loc9_.z))
                if(!nextSpace.IsOpen || nextOpenSpace.G + candidatePenalty < nextSpace.G) {
                    nextSpace.IsOpen = true;
                    nextSpace.ParentX = nextOpenX;
                    nextSpace.ParentY = nextOpenY;
                    nextSpace.G = nextOpenSpace.G + candidatePenalty;
                    nextSpace.F = nextSpace.G + Math.abs(targetX - newX) + Math.abs(targetY - newY); // + Math.abs(param7 - _loc12_);
                }
            }
            candidateIndex++;
        }
    }
}