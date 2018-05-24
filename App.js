/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableHighlight,
  Image,
  Switch
} from 'react-native';
import GridView from 'react-native-super-grid';
import { StackNavigator } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker'

var dateObj = new Date();
var year = dateObj.getFullYear() ;
var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
var day = ("0" + (dateObj.getDate())).slice(-2);

type Props = {};
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Konrad_test',
  };
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        date: new Date(),
        year: year.toString(),
        month: month.toString(),
        day: day.toString(),
        fav_team: 'Blue Jays',
        game_today: true,
     };
     this.transformData = this.transformData.bind(this);
     this.retrieveScorecards = this.retrieveScorecards.bind(this);
     this.handleFavChange = this.handleFavChange.bind(this);
     this.handleDateChange = this.handleDateChange.bind(this);
  }
  retrieveScorecards() {
    var year = this.state.year;
    var month = this.state.month;
    var day = this.state.day;
    var url = "http://gd2.mlb.com/components/game/mlb/year_"+ year +"/month_"+ month +"/day_"+ day +"/master_scoreboard.json";
     fetch(url, { //call to API is made here
     method: 'GET',
      })
     .then(response => response.json())
     .then(data => {
        console.log(data);
        this.transformData(data);
      })
     .catch((error) => {
           console.error(error);
      });
  }
  transformData(data) {
    datalist = [];
    let all_games = data.data.games.game;
    if (all_games && all_games.length > 1) { //for days where there is more than one game
        for (var x in all_games) {
            if("linescore" in all_games[x]) { //copies required data into an array that can be easily rendered
                datalist.push({
                    home_team_name: all_games[x]['home_team_name'],
                    away_team_name: all_games[x]['away_team_name'],
                    home: all_games[x]['linescore']['r']['home'],
                    away: all_games[x]['linescore']['r']['away'],
                    game_data_directory: all_games[x]['game_data_directory'],
                    status: all_games[x]['status']['status']
                });
            }
            else { //for games in the future that dont have a defined linescore
                datalist.push({
                    home_team_name: all_games[x]['home_team_name'],
                    away_team_name: all_games[x]['away_team_name'],
                    game_data_directory: all_games[x]['game_data_directory'],
                    status: all_games[x]['status']['status']
                });
            }
        }
    }
    else if (all_games) {
        if("linescore" in all_games) { //for days where there is only one game
            datalist.push({
                home_team_name: all_games['home_team_name'],
                away_team_name: all_games['away_team_name'],
                home: all_games['linescore']['r']['home'],
                away: all_games['linescore']['r']['away'],
                game_data_directory: all_games['game_data_directory'],
                status: all_games['status']['status']
            });
         }
        else { //for a one game only day in the future that doesnt have a defined linescore
           datalist.push({
                home_team_name: all_games['home_team_name'],
                away_team_name: all_games['away_team_name'],
                game_data_directory: all_games['game_data_directory'],
                status: all_games['status']['status']
             });
        }
    }
    for (var x in datalist) { //sets favourite team to appear on the top
        if(datalist[x].home_team_name == this.state.fav_team || datalist[x].away_team_name == this.state.fav_team) {
            temp = datalist[x];
            datalist[x] = datalist[0];
            datalist[0] = temp;
        }
    }
    this.setState({ //renders the screen
        data: datalist,
        game_today: (datalist.length > 0) ? true : false,
    })
  }
  handleFavChange() {
    this.retrieveScorecards();
  }
  handleDateChange() {
    let datestring = this.state.date.toString();
    let splitDate = datestring.split("-");
    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2];
    this.setState({
        year: year,
        month: month,
        day: day,
    })
    this.retrieveScorecards();
  }
  componentDidMount() {
    this.retrieveScorecards();
  }
  render() {
    const list = this.state.data;
    let all_team_names = [{value: 'Blue Jays'}, {value: 'Rangers'}, {value: 'Red Sox'}, {value: 'Rays'},
        {value: 'Indians'}, {value: 'Royals'}, {value: 'Pirates'}, {value: 'Reds'},
        {value: 'Phillies'}, {value: 'Marlins'}, {value: 'Brewers'}, {value: 'Cubs'},
        {value: 'Tigers'}, {value: 'Padres'}, {value: 'Twins'}, {value: 'Mariners'},
        {value: 'Cardinals'}, {value: 'D-backs'}, {value: 'Yankees'}, {value: 'Orioles'},
        {value: 'Rockies'}, {value: 'Braves'}, {value: 'Giants'}, {value: 'Dodgers'},
        {value: 'Angels'}, {value: 'Athletics'}, {value: 'Nationals'}, {value: 'Mets'},
        {value: 'White Sox'},{value: 'Astros'}];
    return (
      <View style={styles.mainContainer}>
        <View style={styles.inputsContainer}>
            <View style={{alignItems:'center'}}>
                <DatePicker
                    style={{width: 300, paddingTop:0, padding: 10}}
                    date={this.state.date}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    customStyles={{
                      dateIcon: {
                        position:'absolute',
                        left:0,
                        top:4,
                        marginLeft:0
                      },
                      dateInput: {
                        marginLeft:36,
                      },
                      dateText: {
                        fontWeight:'bold',
                        fontSize:20,
                        color:'#ffffff'
                      }
                    }}
                    onDateChange={(date) => {
                    this.setState({date:date})
                    this.handleDateChange()
                    }}
                />
            </View>
            <View style={{alignItems:'center'}}>
                <Text style={{color:'white', paddingTop:10}}>Select your favourie team</Text>
            </View>
            <View style={{flex:1, alignItems:'stretch'}}>
                <Dropdown
                    value ={this.state.fav_team}
                    data={all_team_names}
                    style={{width:200, padding:0, color:'#ffffff', alignContent:'center'}}
                    onChangeText={(data) => {
                    this.setState({fav_team:data})
                    this.handleFavChange()
                    }}
                />
            </View>
        </View>
        <View style={{flex: 2}}>
           {(this.state.game_today == false) &&
                <View style={styles.noDataDisplay}>
                    <Text style={{textAlign: 'center'}}>No games on this day</Text>
                </View>
           }
           {(list.length == 0 && this.state.game_today == true) &&
                <View style={styles.noDataDisplay}>
                   <ActivityIndicator size="large" color="#0000ff" />
                </View>
           }
            <GridView
                itemDimension={300}
                items={list}
                style={styles.gridView}
                renderItem={item => (
                  <View style={[styles.itemContainer]}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{justifyContent: 'space-around', width: 100}}>
                            <Text style={styles.team, Number(item.home) > Number(item.away) ? styles.teamnamewin : styles.teamnamelose}>{item.home_team_name}</Text>
                            <Text style={styles.team, Number(item.away) > Number(item.home) ? styles.teamnamewin : styles.teamnamelose}>{item.away_team_name}</Text>
                            <Text style={styles.itemName}>{item.status}</Text>
                        </View>
                        <View style={{paddingLeft: 30, justifyContent: 'space-around'}}>
                            <Text style={styles.team}>{item.home}</Text>
                            <Text style={styles.team}>{item.away}</Text>
                            <Text> </Text>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        {((item.status !== 'Preview')&&(item.status !== 'Postponed')&&(item.status !== 'Cancelled')) &&
                            <TouchableHighlight
                                style={styles.button}
                                onPress={() => {
                                    this.props.navigation.navigate('Details', {
                                        game_data_directory: item.game_data_directory,
                                    });
                                }}
                            >
                                <Text>Open Scorecard</Text>
                            </TouchableHighlight>
                         }
                    </View>
                  </View>
                )}
            />
        </View>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Scorecard',
  };
  constructor(props) {
    super(props);
    this.state = {
        data: {},
        hometeam: false,
    };
    this.transformData = this.transformData.bind(this);
  }
  transformData(data) {
     console.log(data);
     let all_scores = data.data.boxscore.linescore.inning_line_score;
     let all_home_stats = data.data.boxscore.batting['0'].batter; //for home sats
     let all_away_stats = data.data.boxscore.batting['1'].batter; //for away sats
     var datalist = {};
     var gamescore = [[],[]];
     var batter_home_stats = [[],[],[],[],[],[],[],[]]; //array of arrays used to fill Tables
     var batter_home_names = []; //to fill home team names data column
     var batter_away_stats = [[],[],[],[],[],[],[],[]]; //array of arrays used to fill Tables
     var batter_away_names = []; //to fill away team names data column
     for (var x in all_scores) {
        gamescore[0].push(all_scores[x]['home']);
        gamescore[1].push(all_scores[x]['away']);
     }
     if ((gamescore[0].length < 9) || (gamescore[1].length < 9)) { //if the game is currently in progress and an array shorter than what is expected is created
        for (i=gamescore[0].length; i < 9; i++) {                  //then the remaning spaces are filled with '-' to maintain table and show live game progress
            gamescore[0].push('-');
        }
        for (j=gamescore[1].length; j < 9; j++) {
            gamescore[1].push('-');
        }
     }
     gamescore[0].push(data.data.boxscore.linescore.home_team_runs,data.data.boxscore.linescore.home_team_hits,data.data.boxscore.linescore.home_team_errors); //append score stats
     gamescore[1].push(data.data.boxscore.linescore.away_team_runs,data.data.boxscore.linescore.away_team_hits,data.data.boxscore.linescore.away_team_errors); //append score stats
     for (var x in all_home_stats) { //append player stats
          batter_home_stats[0].push(all_home_stats[x]['name']);
          batter_home_stats[1].push(all_home_stats[x]['ab']);
          batter_home_stats[2].push(all_home_stats[x]['r']);
          batter_home_stats[3].push(all_home_stats[x]['h']);
          batter_home_stats[4].push(all_home_stats[x]['rbi']);
          batter_home_stats[5].push(all_home_stats[x]['bb']);
          batter_home_stats[6].push(all_home_stats[x]['so']);
          batter_home_stats[7].push(all_home_stats[x]['avg']);
     }
     for (var x in all_away_stats) { //append player stats
          batter_away_stats[0].push(all_away_stats[x]['name']);
          batter_away_stats[1].push(all_away_stats[x]['ab']);
          batter_away_stats[2].push(all_away_stats[x]['r']);
          batter_away_stats[3].push(all_away_stats[x]['h']);
          batter_away_stats[4].push(all_away_stats[x]['rbi']);
          batter_away_stats[5].push(all_away_stats[x]['bb']);
          batter_away_stats[6].push(all_away_stats[x]['so']);
          batter_away_stats[7].push(all_away_stats[x]['avg']);
     }
     datalist = { //object with all needed data
          'gamescore': gamescore,
          'away_team_code' : data.data.boxscore.away_team_code.toUpperCase(),
          'away_fname' : data.data.boxscore.away_fname,
          'home_team_code' : data.data.boxscore.home_team_code.toUpperCase(),
          'home_fname' : data.data.boxscore.home_fname,
          'home_hits' : data.data.boxscore.linescore.home_team_hits,
          'away_hits' : data.data.boxscore.linescore.away_team_hits,
          'home_error' : data.data.boxscore.linescore.home_team_errors,
          'away_error' : data.data.boxscore.linescore.away_team_errors,
          'date' : data.data.boxscore.date,
          'venue_name' : data.data.boxscore.venue_name,
          'batters_home_stats' :  batter_home_stats,
          'batters_away_stats' :  batter_away_stats
     };
    this.setState({
        data: datalist,
    })
  }
  componentDidMount() {
     var game_data_directory = this.props.navigation.getParam('game_data_directory');
     var url = "http://gd2.mlb.com"+ game_data_directory +"/boxscore.json";
     fetch(url, { //call to API is made here
        method: 'GET',
     })
     .then(response => response.json())
     .then(data => {
        this.transformData(data);
     })
     .catch((error) => {
           console.error(error);
     });
  }
  handleStatSwitch = () => {
      this.setState({
        hometeam: (this.state.hometeam = !this.state.hometeam),
      })
  }
  render() {
     const list = this.state.data;
     const head_col = [['Team'], this.state.data.home_team_code, this.state.data.away_team_code];
     const whichteam = this.state.hometeam;
     const headers = ['1','2','3','4','5','6','7','8','9','R','H','E'];
     const player_stats = ['Name','AB', 'R', 'H', 'RBI', 'BB', 'SO', 'AVG'];
     return (
        <View style={styles.mainContainer}>
            <View style={styles.gameInfo}>
                <View style={styles.gameInfoTextSpace}>
                    <Text style={styles.gameInfoText}>{list.date}</Text>
                </View>
                <View style={styles.gameInfoTextSpace}>
                    <Text style={styles.gameInfoText}>{list.home_fname} vs {list.away_fname}</Text>
                </View>
                <View style={styles.gameInfoTextSpace}>
                    <Text style={styles.gameInfoText}>{list.venue_name}</Text>
                </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row', alignContent: 'stretch', padding:5}}>
               <View style={{flex: 1, backgroundColor: '#fff',  justifyContent: 'center'}}>
                     <Table borderStyle ={{borderWidth: 0, borderColor:'white'}}>
                        <TableWrapper style={styles.wrapper}>
                            <Col data={head_col} style={styles.title} heightArr={[28,28,28]} textStyle={styles.text}/>
                        </TableWrapper>
                     </Table>
               </View>
               <View style={{flex: 4, backgroundColor: '#fff',  justifyContent: 'center', paddingRight:10}}>
                    <Table borderStyle ={{borderWidth: 0, borderColor:'white'}}>
                        <Row data={headers} flexArr={[1, 1, 1, 1]} style={styles.row} textStyle={styles.text}/>
                        <TableWrapper style={styles.wrapper}>
                            <Rows data={list.gamescore} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text}/>
                        </TableWrapper>
                    </Table>
               </View>
            </View>
            <View style={styles.switchContainer}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={styles.switchText}>{list.home_fname}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Switch
                        style={{transform: [{ scaleX: 2 }, { scaleY: 2 }]}}
                        value={whichteam}
                        onValueChange={() =>
                        this.handleStatSwitch()
                        }
                    />
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={styles.switchText}>{list.away_fname}</Text>
                </View>
            </View>
            <View style={{flex: 3, flexDirection: 'row', alignContent: 'stretch', padding:5}}>
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <ScrollView style={styles.dataWrapper}>
                        <Table borderStyle ={{borderWidth: 0, borderColor:'white'}}>
                            <Row data={player_stats} flexArr={[2, 1, 1, 1]} style={styles.title} textStyle={styles.text}/>
                            <TableWrapper style={{flex:1}}>
                                <Cols data={this.state.hometeam ? list.batters_away_stats : list.batters_home_stats} flexArr={[2, 1, 1, 1]}  style={styles.title} textStyle={styles.text}/>
                            </TableWrapper>
                        </Table>
                    </ScrollView>
                </View>
            </View>
        </View>
     );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack/>;
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
  inputsContainer: {
    flex: 1,
    paddingTop:20,
    alignItems:'stretch',
    backgroundColor:'#4267b2',
  },
  noDataDisplay: {
    flex:1,
    margin: 20,
  },
  button: {
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent:'center',
    borderColor:'black',
    borderRadius: 10,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  gameInfo: {
    flex: 2,
    flexDirection: 'column',
    borderRadius:30,
    borderColor:'#4267b2',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  gameInfoTextSpace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameInfoText: {
    color:'#4267b2',
    fontSize: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:'#4267b2',
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  switchText: {
    color:'#4267b2',
    fontSize:12,
  },
  teamname:{
    fontWeight: "100",
  },
  teamnamewin:{
    fontWeight: "bold",
  },
  teamnamelose:{
    fontWeight: "100",
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  gridView: {
    paddingTop: 25,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    justifyContent:'center',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: 'grey',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    height: 150,
    backgroundColor: '#ffffff',
  },
  text: {
    margin: 2,
    fontSize: 10,
    textAlign: 'center',
  },
  head: {
    height: 28,
    backgroundColor: '#f1f8ff',
  },
  title: {
    backgroundColor:'white',
  },
  wrapper: {
    flexDirection: 'row',
  },
  row: {
    height: 28,
    alignItems: 'center',
  },
  dataWrapper: {
    marginTop: -1,
  },
});
