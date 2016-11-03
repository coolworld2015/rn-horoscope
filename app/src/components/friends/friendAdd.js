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
    DatePickerIOS
} from 'react-native';

class FriendAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showProgress: false,
            date: new Date(),
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
        }
    }

    onDateChange = (date) => {
        this.setState({date: date});
        console.log(date.getFullYear());
        console.log(date.getDate());
        console.log(date.getMonth());
    };

    getSignName(bdate) {
        var signName;
        console.log(bdate);
        //var parseDate = bdate.split("/");
        //var day = parseDate[1];
        //var month = parseDate[0].replace('0', '');

        var day = bdate.getDate();
        var month = bdate.getMonth() * 1 + 1;

        console.log(day + ' - ' + month);

        var zodiac = ['', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo',
            'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
        var last_day = ['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];

        if (last_day[month] < day) {
            signName = zodiac[month + 1];
        } else {
            signName = zodiac[month];
        }

        if (signName == undefined) {
            signName = 'Capricorn';
        }
        return signName;
    }

    localStorageInsert() {
        if (this.state.name == undefined ||
            this.state.date == undefined) {
            this.setState({
                invalidValue: true
            });
            return;
        }

        this.setState({
            showProgress: true
        });

        var friends = [];
        var id = +new Date;

        var sign = this.getSignName(this.state.date);

        var bdate = (this.state.date.getMonth() + 1) + '/' + this.state.date.getDate() + '/' + this.state.date.getFullYear();

        var item = {
            id: id,
            name: this.state.name,
            date: bdate,
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
                    .then(json => {
                            App.friends.refresh = true;
                            this.props.navigator.pop();
                        }
                    );
            })
            .catch(error => console.log(error));
    }

    render() {
        var errorCtrl, validCtrl;

        if (this.state.serverError) {
            errorCtrl = <Text style={styles.error}>
                Something went wrong.
            </Text>;
        }

        if (this.state.invalidValue) {
            validCtrl = <Text style={styles.error}>
                Value required - please provide.
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
            <ScrollView style={{backgroundColor: 'white'}}>
                <View style={{
                    flex: 1,
                    padding: 5,
                    justifyContent: 'flex-start'
                }}>
                    <Text style={{
                        fontSize: 24,
                        textAlign: 'center',
                        marginTop: 5,
                        fontWeight: "bold",
                        color: 'black'
                    }}>
                        New friend
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        textAlign: 'center',
                        marginTop: 15,
                        fontWeight: "bold",
                        color: 'black'
                    }}>
                        Name
                    </Text>

                    <TextInput
                        onChangeText={(text)=> this.setState({
                            name: text,
                            invalidValue: false
                        })}
                        style={styles.loginInput}
                        value={this.state.name}
                        placeholderTextColor="gray"
                        placeholder="Enter name here">
                    </TextInput>

                    <Text style={{
                        fontSize: 16,
                        textAlign: 'center',
                        margin: 15,
                        fontWeight: "bold",
                        color: 'black'
                    }}>
                        Date of birth
                    </Text>

                    <View style={{backgroundColor: 'white', marginTop: -15}}>
                        <DatePickerIOS
                            date={this.state.date}
                            mode="date"
                            textColor="black"
                            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                            onDateChange={this.onDateChange}
                        />
                    </View>

                    {validCtrl}

                    <TouchableHighlight
                        onPress={()=> this.localStorageInsert()}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableHighlight>

                    {errorCtrl}


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
        color: 'black'
    },
    loginInput: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 0,
        color: 'black',
        //fontWeight: "bold"
    },
    descriptionInput: {
        height: 150,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 0,
        color: 'black'
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 20,
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
