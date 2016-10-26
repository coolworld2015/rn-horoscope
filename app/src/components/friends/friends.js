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

        this.getFriends();
    }

    componentWillUpdate() {
        if (App.friends.refresh) {
            App.friends.refresh = false;

            this.setState({
                showProgress: true
            });

            this.getFriends();
        }
    }

    getFriends() {
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
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) {
            return -1
        }
        if (nameA > nameB) {
            return 1
        }
        return 0;
    }

    deleteFriend(id) {
        this.setState({
            showProgress: true
        });

        var friends = [];

        AsyncStorage.getItem('rn-horoscope.friends')
            .then(req => JSON.parse(req))
            .then(json => {

                friends = [].concat(json);

                console.log(friends);
                for (var i = 0; i < friends.length; i++) {
                    if (friends[i].id == id) {
                        friends.splice(i, 1);
                        break;
                    }
                }

                AsyncStorage.setItem('rn-horoscope.friends', JSON.stringify(friends))
                    .then(json => {
                            App.friends.refresh = true;
                            this.props.navigator.pop();
                        }
                    );
            })
            .catch(error => console.log(error))
    }

    pressRow(rowData) {
        this.props.navigator.push({
            title: rowData.name,
            component: FriendsDetails,
            rightButtonTitle: 'Delete',
            onRightButtonPress: () => {
                Alert.alert(
                    'Delete',
                    'Are you sure you want to delete ' + rowData.name + '?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {
                            text: 'OK', onPress: () => {
                            this.deleteFriend(rowData.id);
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

        switch (rowData.sign) {
            case 'Aries':
                image = <Image source={require('../../../img/Aries.jpg')}
                               style={styles.img}/>;
                break;

            case 'Taurus':
                image = <Image source={require('../../../img/Taurus.jpg')}
                               style={styles.img}/>;
                break;

            case 'Gemini':
                image = <Image source={require('../../../img/Gemini.jpg')}
                               style={styles.img}/>;
                break;

            case 'Cancer':
                image = <Image source={require('../../../img/Cancer.jpg')}
                               style={styles.img}/>;
                break;

            case 'Leo':
                image = <Image source={require('../../../img/Leo.jpg')}
                               style={styles.img}/>;
                break;

            case 'Virgo':
                image = <Image source={require('../../../img/Virgo.jpg')}
                               style={styles.img}/>;
                break;

            case 'Libra':
                image = <Image source={require('../../../img/Libra.jpg')}
                               style={styles.img}/>;
                break;

            case 'Scorpio':
                image = <Image source={require('../../../img/Scorpio.jpg')}
                               style={styles.img}/>;
                break;

            case 'Sagittarius':
                image = <Image source={require('../../../img/Sagittarius.jpg')}
                               style={styles.img}/>;
                break;

            case 'Capricorn':
                image = <Image source={require('../../../img/Capricorn.jpg')}
                               style={styles.img}/>;
                break;

            case 'Aquarius':
                image = <Image source={require('../../../img/Aquarius.jpg')}
                               style={styles.img}/>;
                break;

            case 'Pisces':
                image = <Image source={require('../../../img/Pisces.jpg')}
                               style={styles.img}/>;
                break;

        }

        return (
            <TouchableHighlight
                onPress={()=> this.pressRow(rowData)}
                underlayColor='#ddd'>

                <View style={styles.imgsList}>

                    {image}

                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.text}>{rowData.name}</Text>
                        <Text style={styles.text}>{rowData.date}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    refreshData(event) {
        if (this.state.showProgress == true) {
            return;
        }

        if (event.nativeEvent.contentOffset.y <= -150) {

            this.setState({
                showProgress: true,
                resultsCount: 0
            });

            setTimeout(() => {
                this.getFriends()
            }, 100);
        }
    }

    onChangeText(text) {
        if (this.state.responseData == undefined) {
            return;
        }

        var arr = [].concat(this.state.responseData);

        var items = arr.filter((el) => el.name.toLowerCase().indexOf(text.toLowerCase()) >= 0);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(items),
            resultsCount: items.length,
        })
    }

    render() {
        var errorCtrl, loader;

        if (this.state.serverError) {
            errorCtrl = <Text style={styles.error}>
                Something went wrong.
            </Text>;
        }

        if (this.state.showProgress) {
            loader = <View style={{
                justifyContent: 'center',
                height: 100
            }}>
                <ActivityIndicator
                    size="large"
                    animating={true}/>
            </View>;
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
                               onChangeText={this.onChangeText.bind(this)}
                               placeholder="Search here">
                    </TextInput>

                    {errorCtrl}

                </View>

                {loader}

                <ScrollView
                    onScroll={this.refreshData.bind(this)} scrollEventThrottle={16}>
                    <ListView
                        style={{marginTop: -65, marginBottom: -45}}
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
    text: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    img: {
        height: 95,
        width: 90,
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
