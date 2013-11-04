var gameCtrl = controllers.controller("GameCtrl", function($scope, Restangular){

    $scope.teamEditing = false;
    refreshScopeData();

    function refreshScopeData(){
        Restangular.all("players").getList().then(function(players){
            $scope.players = players;
            Restangular.all("games").getList().then(function(games){
                $scope.games = games;
                //Sorting the collection by timestamps while attaching a timestamp attribute to each element.
                _.sortBy($scope.games, function(game) { return game.timestamp = parseInt(game._id.toString().substring(0,8), 16 ) * 1000; });
                //Providing then an index attribute for quicker access.
                for(var i=0;i<$scope.games.length;i++){
                    $scope.games[i].index = i;
                }
                //Selecting the latest element.
                $scope.game = $scope.games[$scope.games.length-1];
                $scope.game.teamA.score = '-';
                $scope.game.teamB.score = '-';
                $scope.selectedGame = $scope.game.index;
                $scope.pageStart = getPaginationStart($scope.selectedGame, $scope.games.length);
                attributeTeamAndGoals();
            }, function errorCallback() {
                alert("Oops unable to get info from server. Please refresh. :(");
            });
        }, function errorCallback() {
            alert("Oops unable to get info from server. Please refresh. :(");
        });
    };

    //Adds as attribute of each player a team reference and the number of scored goals and own goals depending on the current game.
    function attributeTeamAndGoals(){
        for(var i=0;i<$scope.players.length;i++){
            var player = $scope.players[i];
            if(_.contains($scope.game.teamA.teammateRefs, player._id)){
                player.teamRef = "A";
                player.scored = _.reduce($scope.game.teamA.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                player.ownGoals = _.reduce($scope.game.teamB.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
            } else if (_.contains($scope.game.teamB.teammateRefs, player._id)){
                player.teamRef = "B";
                player.scored = _.reduce($scope.game.teamB.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
                player.ownGoals = _.reduce($scope.game.teamA.scorersRefs, function(memo, scorerRef){ return player._id == scorerRef ? memo+1 : memo; }, 0);
            } else {
                player.teamRef = "N";
            }
        }
    }

    $scope.join = function(player){
        $('#updateFade').modal('toggle');
        var team = {};
        var keyTeam = "";
        if(player.teamRef==="N"){
            team = ($scope.game.teamA.teammateRefs.length <= $scope.game.teamB.teammateRefs.length) ? $scope.game.teamA : $scope.game.teamB ;
            keyTeam = ($scope.game.teamA.teammateRefs.length <= $scope.game.teamB.teammateRefs.length) ? "A" : "B" ;
        } else {
            team = (player.teamRef==="A") ? $scope.game.teamB : $scope.game.teamA ;
            keyTeam = (player.teamRef==="A") ? "B" : "A" ;
        }
        $scope.game.customPUT({}, "join", {keyTeam: keyTeam, keyPlayer: player._id}).then(function(){
            team.teammateRefs.push(player._id);
            player.teamRef = keyTeam;
        }, function errorCallback() {
            alert("Oooops unable to update server. Please refresh. :(");
        });
        $('#updateFade').modal('toggle');
    }

    //Updates the current game object to the one at the index in parameter.
    $scope.setGame = function (index){
        if( ($scope.selectedGame != index) && (index >= 0) && (index < $scope.games.length) ){
            $scope.game = $scope.games[index];
            $scope.selectedGame = index;
            attributeTeamAndGoals();
            $scope.pageStart = getPaginationStart($scope.selectedGame, $scope.games.length);
        }
    }

    //Returns the index at which the pagination should start.
    function getPaginationStart(currentIndex, length){
        var startPageIndex =  currentIndex - 2;
        if(currentIndex < 3) {
            startPageIndex = 0;
        } else if(currentIndex > (length - 3)){
            startPageIndex = length - 5;
        }
        return startPageIndex;
    }
});