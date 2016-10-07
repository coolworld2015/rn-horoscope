'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    ListView,
    ScrollView,
    ActivityIndicator,
    TabBarIOS,
    NavigatorIOS,
    TextInput,
    AsyncStorage,
    Alert
} from 'react-native';

import FriendsDetails from './friendsDetails';

class Friends extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            searchQuery: props.searchQuery,
            showProgress: true,
            resultsCount: 0
        };

        this.getFavoritesMovies();
    }

    getFavoritesMovies() {
        AsyncStorage.getItem('rn-horoscope.friends')
            .then(req => JSON.parse(req))
            .then(json => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(json.sort(this.sort)),
                    resultsCount: json.length,
                    responseData: json
                });
                console.log(json);
            })
            .catch(error => console.log(error))
            .finally(()=> {
                this.setState({
                    showProgress: false
                });
            });
    }

    sort(a, b) {
        var nameA = a.trackName.toLowerCase(), nameB = b.trackName.toLowerCase();
        if (nameA < nameB) {
            return -1
        }
        if (nameA > nameB) {
            return 1
        }
        return 0;
    }

    localStorageInsert() {
        var movies = [];

        AsyncStorage.getItem('rn-horoscope.friends')
            .then(req => JSON.parse(req))
            .then(json => {
                movies = [].concat(json);
                movies.push(this.state.pushEvent);

                if (movies[0] == null) {
                    movies.shift()
                } // Hack !!!
                console.log(movies);

                AsyncStorage.setItem('rn-movies.movies', JSON.stringify(movies))
                    .then(json => this.props.navigator.pop());

            })
            .catch(error => console.log(error));

        // AsyncStorage.setItem('rn-movies.movies', JSON.stringify(movies))
        //   .then(json => this.props.navigator.pop());
    }

    deleteMovie(id) {
        var friends = [];

        AsyncStorage.getItem('rn-horoscope.friends')
            .then(req => JSON.parse(req))
            .then(json => {

                friends = [].concat(json);

                console.log(friends);
                for (var i = 0; i < friends.length; i++) {
                    if (friends[i].trackId == id) {
                        friends.splice(i, 1);
                        break;
                    }
                }

                AsyncStorage.setItem('rn-horoscope.friends', JSON.stringify(friends))
                    .then(json => this.props.navigator.pop());

            })
            .catch(error => console.log(error))
    }

    pressRow(rowData) {
        this.props.navigator.push({
            title: rowData.trackName,
            component: FriendsDetails,
            rightButtonTitle: 'Delete',
            onRightButtonPress: () => {
                Alert.alert(
                    'Delete',
                    'Are you sure you want to delete ' + rowData.trackName + '?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {
                            text: 'OK', onPress: () => {
                            this.deleteMovie(rowData.trackId);
                        }
                        },
                    ]
                );
            },
            passProps: {
                pushEvent: rowData
            }
        });
    }

    renderRow(rowData) {
        var image;
        image = <Image source={require('../../../img/Aries.jpg')}
                       style={styles.img}/>;

        return (
            <TouchableHighlight
                onPress={()=> this.pressRow(rowData)}
                underlayColor='#ddd'
            >
                <View style={styles.imgsList}>

                    {image}

                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <Text>{rowData.trackName}</Text>
                        {/*<Text>{rowData.releaseDate.split('-')[0]}</Text>*/}
                        {/*<Text>{rowData.country}</Text>*/}
                        {/*<Text>{rowData.primaryGenreName}</Text>*/}
                        {/*<Text>{rowData.artistName}</Text>*/}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    refreshData(event) {
        if (event.nativeEvent.contentOffset.y <= -100) {

            this.setState({
                showProgress: true,
                serverError: false,
                //resultsCount: event.nativeEvent.contentOffset.y
            });
            setTimeout(() => {
                this.getFavoritesMovies()
            }, 300);
        }
    }

    render() {
        var errorCtrl = <View />;

        if (this.state.serverError) {
            errorCtrl = <Text style={styles.error}>
                Something went wrong.
            </Text>;
        }

        if (this.state.showProgress) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <ActivityIndicator
                        size="large"
                        animating={true}/>
                </View>
            );
        }
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{marginTop: 60}}>
                    <TextInput style={{
                        height: 45,
                        marginTop: 4,
                        padding: 5,
                        backgroundColor: 'white',
                        borderWidth: 3,
                        borderColor: 'lightgray',
                        borderRadius: 0,
                    }}
                               onChangeText={(text)=> {
                                   if (this.state.responseData == undefined) {
                                       return;
                                   }
                                   var arr = [].concat(this.state.responseData);
                                   var items = arr.filter((el) => el.trackName.indexOf(text) != -1);
                                   this.setState({
                                       dataSource: this.state.dataSource.cloneWithRows(items),
                                       resultsCount: items.length,
                                   })
                               }}
                               placeholder="Search here">
                    </TextInput>

                    {errorCtrl}

                </View>

                <ScrollView
                    onScroll={this.refreshData.bind(this)} scrollEventThrottle={16}
                    style={{marginTop: 0, marginBottom: 0}}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                    />
                </ScrollView>

                <View style={{marginBottom: 49}}>
                    <Text style={styles.countFooter}>
                        {this.state.resultsCount} entries were found.
                    </Text>
                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    imgsList: {
        flex: 1,
        flexDirection: 'row',
        padding: 0,
        alignItems: 'center',
        borderColor: '#D7D7D7',
        borderBottomWidth: 1,
        backgroundColor: '#fff'
    },
    countHeader: {
        fontSize: 16,
        textAlign: 'center',
        padding: 15,
        backgroundColor: '#F5FCFF',
    },
    countFooter: {
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        borderColor: '#D7D7D7',
        backgroundColor: 'whitesmoke'
    },
    img: {
        height: 95,
        width: 75,
        borderRadius: 20,
        margin: 20
    },
    error: {
        color: 'red',
        paddingTop: 10,
        textAlign: 'center'
    }
});

export default Friends;
