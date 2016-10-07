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
    AsyncStorage
} from 'react-native';

//import Users from './users';

class FriendAdd extends Component {
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

        var id = +new Date;

        fetch('http://ui-budget.herokuapp.com/api/users/add/', {
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

    getSignName(bdate) {
        var signName;
        var parseDate = bdate.split("/");
        var day = parseDate[1];
        var month = parseDate[0].replace('0', '');

        var zodiac = ['', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo',
            'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
        var last_day = ['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];

        if (last_day[month] < day) {
            signName = zodiac[month * 1 + 1];
        } else {
            signName = zodiac[month];
        }

        return signName;
    }

    localStorageInsert() {
        if (this.state.name == undefined ||
            this.state.date == undefined ||
            this.state.description == undefined) {
            this.setState({
                invalidValue: true
            });
            return;
        }

        var friends = [];
        var id = +new Date;

        var sign = this.getSignName(this.state.date);

        var item = {
            id: id,
            name: this.state.name,
            date: this.state.date,
            sign: sign,
            description: this.state.description
        };

        AsyncStorage.getItem('rn-horoscope.friends')
            .then(req => JSON.parse(req))
            .then(json => {
                friends = [].concat(json);
                friends.push(item);

                if (friends[0] == null) { // TODO: Hack !!!
                    friends.shift()
                }
                console.log(friends);

                AsyncStorage.setItem('rn-horoscope.friends', JSON.stringify(friends))
                    .then(json => this.props.navigator.pop());

            })
            .catch(error => console.log(error));
    }

    render() {
        var errorCtrl;

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
                    padding: 5,
                    justifyContent: 'flex-start'
                }}>

                    <Text style={{
                        fontSize: 24,
                        textAlign: 'center',
                        marginTop: 5,
                        fontWeight: "bold"
                    }}>
                        New friend
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
                            date: text,
                            invalidValue: false
                        })}
                        style={styles.loginInput}
                        value={this.state.date}
                        placeholder="Date of birth (mm/dd/year)">
                    </TextInput>

                    <TextInput
                        onChangeText={(text)=> this.setState({
                            description: text,
                            invalidValue: false
                        })}
                        style={styles.descriptionInput}
                        value={this.state.description}
                        multiline={true}
                        placeholder="Description">
                    </TextInput>

                    {validCtrl}

                    <TouchableHighlight
                        onPress={()=> this.localStorageInsert()}
                        style={styles.button}>
                        <Text style={styles.buttonText}>New</Text>
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
        color: 'black'
    },
    descriptionInput: {
        height: 150,
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

export default FriendAdd;
