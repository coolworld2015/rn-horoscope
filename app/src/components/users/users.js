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
    Alert
} from 'react-native';

import UserDetails from './userDetails';

class Users extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            showProgress: true,
            serverError: false,
            resultsCount: 0
        };

        this.getUsers();
    }

    getUsers() {
        fetch('http://ui-base.herokuapp.com/api/users/get', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response)=> response.json())
            .then((responseData)=> {

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.sort(this.sort)),
                    resultsCount: responseData.length,
                    responseData: responseData
                });
            })
            .catch((error)=> {
                this.setState({
                    serverError: true
                });
            })
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

    deleteUser(id) {
        this.setState({
            showProgress: true
        });

        fetch('http://ui-base.herokuapp.com/api/users/delete/', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

            .then((responseData)=> {
            })
            .catch((error)=> {
                console.log(error);
                this.setState({
                    serverError: true
                });
            })
            .finally(()=> {
                this.setState({
                    showProgress: false
                });
                this.props.navigator.pop();
            });
    }

    pressRow(rowData) {
        this.props.navigator.push({
            title: 'Edit',
            component: UserDetails,
            rightButtonTitle: 'Delete',
            onRightButtonPress: () => {
                Alert.alert(
                    'Delete user',
                    'Are you sure you want to delete user ' + rowData.name + '?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {
                            text: 'OK', onPress: () => {
                            this.deleteUser(rowData.id);
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
        return (
            <TouchableHighlight
                onPress={()=> this.pressRow(rowData)}
                underlayColor='#ddd'
            >

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    padding: 20,
                    alignItems: 'center',
                    borderColor: '#D7D7D7',
                    borderBottomWidth: 1,
                    backgroundColor: '#fff'
                }}>

                    <Text style={{backgroundColor: '#fff'}}>
                        {rowData.name}
                    </Text>

                </View>

            </TouchableHighlight>
        );
    }

    refreshData(event) {
        if (event.nativeEvent.contentOffset.y <= -100) {

            this.setState({
                showProgress: true,
                resultsCount: event.nativeEvent.contentOffset.y
            });
            setTimeout(() => {
                this.getUsers()
            }, 300);
        }
    }


    render() {
        var swipeoutBtns = [
            {
                text: 'Delete',
                backgroundColor: 'red',
            }
        ]

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
                                   var arr = [].concat(this.state.responseData);
                                   var items = arr.filter((el) => el.name.indexOf(text) != -1);
                                   this.setState({
                                       dataSource: this.state.dataSource.cloneWithRows(items),
                                       resultsCount: items.length,
                                   })
                               }}
                               placeholder="Search">
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
    AppContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
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
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    loginInput: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 0,
        color: 'gray'
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
        paddingTop: 10,
        textAlign: 'center'
    },
    img: {
        height: 95,
        width: 75,
        borderRadius: 20,
        margin: 20
    }
});

export default Users;
