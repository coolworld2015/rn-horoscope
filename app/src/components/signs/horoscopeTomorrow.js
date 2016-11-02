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

class HoroscopeTomorrow extends Component {
    constructor(props) {
        super(props);

        var d = new Date;
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var monthTomorrow = month;
        var today = d.getDate();
        var dayTomorrow;

        if (today == 30) {
            dayTomorrow = '01';
            monthTomorrow = month + 1;
        } else {
            dayTomorrow = today + 1;
        }


        var tomorrowDate = monthTomorrow + '/' + dayTomorrow + '/' + year;
        var tomorrow = monthTomorrow + '/' + dayTomorrow;

        this.state = {
            showProgress: true,
            tomorrowDate: tomorrowDate,
            tomorrow: tomorrow,
            data: {
                details: {}
            }
        };

        this.getHoroscope();
    }

    paramDate(param) {
        var d, today, yesterday, tomorrow, month, paramDate,
            year, monthTomorrow, monthYesterday;
        d = new Date;
        year = d.getFullYear();
        month = d.getMonth() + 1;
        monthTomorrow = month;
        monthYesterday = month;
        today = d.getDate();

        if (today == '01') {
            monthYesterday = month - 1;
            yesterday = '30';
        } else {
            yesterday = today - 1;
        }

        if (today == 30) {
            tomorrow = '01';
            monthTomorrow = month + 1;
        } else {
            tomorrow = today + 1;
        }

        if (month == 13) {
            month = '12'
        }

        switch (param) {
            case 'today':
                paramDate = month + '/' + today + '/' + year;
                break;
            case 'yesterday':
                paramDate = monthYesterday + '/' + yesterday + '/' + year;
                break;
            case 'tomorrow':
                paramDate = monthTomorrow + '/' + tomorrow + '/' + year;
                break;
            default:
                paramDate = month + '/' + day + '/' + year;
                break;
        }
        return paramDate;
    }

    getHoroscope() {
        fetch('http://m-api.californiapsychics.com/horoscope?format=json'
            + "&sign=" + this.props.pushEvent.name + "&date=" + this.state.tomorrow, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response)=> response.json())
            .then((responseData)=> {
                var data = responseData[0];
                this.setState({
                    data: data,
                    showProgress: false
                });
            })
            .catch((error)=> {
                this.setState({
                    serverError: true
                });
                console.log(error);
            })
            .finally(()=> {
                this.setState({
                    showProgress: false
                });
            });
    }

    render() {
        var image;

        switch (this.props.pushEvent.name) {
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

        var errorCtrl;

        if (this.state.serverError) {
            errorCtrl = <Text style={styles.error}>
                Something went wrong.
            </Text>;
        }

        if (this.state.showProgress) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: 'black'
                }}>
                    <ActivityIndicator
                        size="large"
                        animating={true}/>
                </View>
            );
        }

        return (
            <ScrollView style={{backgroundColor: 'black'}}>
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 65,
                    marginBottom: 65
                }}>
                    {errorCtrl}

                    {image}

                    <Text style={styles.welcome}>
                        {this.state.data.signName} on {this.state.tomorrowDate}
                    </Text>


                    <Text style={styles.welcome1}>
                        {this.state.data.details.scope}
                    </Text>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    AppContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    img: {
        height: 270,
        width: 270,
        borderRadius: 20,
        margin: 20
    },
    welcome: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
        color: 'white'
    },
    welcome1: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        color: 'white'
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
        margin: 10,
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

export default HoroscopeTomorrow;
