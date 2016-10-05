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
    TextInput
} from 'react-native';

import Users from './users';

class UserAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showProgress: false
        }
    }

    addUser() {
        if (this.state.name == undefined ||
            this.state.pass == undefined ||
            this.state.description == undefined) {
            this.setState({
                invalidValue: true
            });
            return;
        }

        this.setState({
            showProgress: true
        });

        var id = (Math.random() * 1000000).toFixed();

        fetch('http://ui-base.herokuapp.com/api/users/add/', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                name: this.state.name,
                pass: this.state.pass,
                description: this.state.description
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response)=> response.json())
            .then((responseData)=> {
                this.props.navigator.pop()
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
            });
    }

    render() {
        var errorCtrl = <View />;

        if (this.state.serverError) {
            errorCtrl = <Text style={styles.error}>
                Something went wrong.
            </Text>;
        }

        var validCtrl = <View />;

        if (this.state.invalidValue) {
            validCtrl = <Text style={styles.error}>
                Value required - please provide.
            </Text>;
        }

        return (
            <ScrollView>
                <View style={{
                    flex: 1,
                    padding: 10,
                    justifyContent: 'flex-start'
                }}>

                    <Text style={{
                        fontSize: 24,
                        textAlign: 'center',
                        marginTop: 0,
                        fontWeight: "bold"
                    }}>
                        New user
                    </Text>

                    <TextInput
                        onChangeText={(text)=> this.setState({
                            name: text,
                            invalidValue: false
                        })}
                        style={styles.loginInput}
                        value={this.state.name}
                        placeholder="Name">
                    </TextInput>

                    <TextInput
                        onChangeText={(text)=> this.setState({
                            pass: text,
                            invalidValue: false
                        })}
                        style={styles.loginInput}
                        value={this.state.pass}
                        placeholder="Password">
                    </TextInput>

                    <TextInput
                        onChangeText={(text)=> this.setState({
                            description: text,
                            invalidValue: false
                        })}
                        style={styles.loginInput}
                        value={this.state.description}
                        placeholder="Description">
                    </TextInput>

                    {validCtrl}

                    <TouchableHighlight
                        onPress={()=> this.addUser()}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Add item</Text>
                    </TouchableHighlight>

                    {errorCtrl}

                    <ActivityIndicator
                        animating={this.state.showProgress}
                        size="large"
                        style={styles.loader}
                    />
                </View>
            </ScrollView>
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

export default UserAdd;
