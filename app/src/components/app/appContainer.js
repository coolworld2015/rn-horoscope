//'use strict';

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
    ActivityIndicatorIOS,
    TabBarIOS,
    NavigatorIOS,
    TextInput,
    AsyncStorage
} from 'react-native';

import Signs from '../signs/signs';
import Friends from '../friends/friends';
import FriendAdd from '../friends/friendAdd';

class AppContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'Signs'
        };

        App = {
            friends: {
                refresh: false
            }
        };
    }

    localStorageInsert() {
        var movies = [];

        AsyncStorage.getItem('rn-horoscope.friends')
            .then(req => JSON.parse(req))
            .then(json => {
                movies = [].concat(json);
                //movies.push(this.state.pushEvent);
                movies.push({trackName: 'Cool'});

                if (movies[0] == null) {
                    movies.shift()
                } // Hack !!!
                console.log(movies);

                AsyncStorage.setItem('rn-horoscope.friends', JSON.stringify(movies))
                    .then(json => this.props.navigator.pop());

            })
            .catch(error => console.log(error));

        // AsyncStorage.setItem('rn-movies.movies', JSON.stringify(movies))
        //   .then(json => this.props.navigator.pop());
    }

    render() {
        return (
            <TabBarIOS style={styles.AppContainer}>

                <TabBarIOS.Item
                    title="Signs"
                    systemIcon="favorites"
                    selected={this.state.selectedTab == 'Signs'}
                    onPress={()=> this.setState({selectedTab: 'Signs'})}>

                    <NavigatorIOS
                        style={{
                            flex: 1
                        }}
                        initialRoute={{
                            component: Signs,
                            title: 'List of signs',
                            passProps: {
                                searchQuery: 'Sex'
                            }
                        }}
                    />
                </TabBarIOS.Item>

                <TabBarIOS.Item
                    title="Friends"
                    systemIcon="contacts"
                    selected={this.state.selectedTab == 'Friends'}
                    onPress={()=> this.setState({selectedTab: 'Friends'})}>

                    <NavigatorIOS
                        style={{
                            flex: 1
                        }}
                        ref="emp"
                        initialRoute={{
                            component: Friends,
                            title: 'List of friends',
                            rightButtonTitle: 'New',
                            onRightButtonPress: () => {
                                {/*this.localStorageInsert();*/}
                                {/*return;*/}

                                this.refs.emp.navigator.push({
                                    title: "New",
                                    component: FriendAdd
                                });
                            }
                        }}
                    />
                </TabBarIOS.Item>

            </TabBarIOS>
        );
    }
}

/*
 systemIcon List:
 bookmarks
 contacts
 downloads
 favorites
 featured
 history
 more
 "most-recent"
 "most-viewed"
 recents
 search
 "top-rated"
 */

const styles = StyleSheet.create({
    AppContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'black',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    container: {
        backgroundColor: '#F5FCFF',
        paddingTop: 40,
        padding: 10,
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: 66,
        height: 65
    },
    heading: {
        fontSize: 30,
        margin: 10,
        marginBottom: 20
    },
    loginInput: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#48BBEC'
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 24
    },
    loader: {
        marginTop: 20
    },
    error: {
        color: 'red',
        paddingTop: 10
    }
});

export default AppContainer;
