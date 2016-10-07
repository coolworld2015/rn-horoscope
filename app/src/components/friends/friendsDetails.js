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

class FriendsDetails extends Component {
    constructor(props) {
        super(props);

        var d = new Date;
        var todayDate = d.getMonth() + 1 + '/' + (d.getDate()) + '/' + d.getFullYear();
        var today = d.getMonth() + 1 + '/' + (d.getDate());

        this.state = {
            showProgress: true,
            todayDate: todayDate,
            today: today,
            name: props.pushEvent.name,
            date: props.pushEvent.date,
            sign: props.pushEvent.sign,
            description: props.pushEvent.description,
        };

        this.getHoroscope();
    }

    getHoroscope() {
        fetch('http://m-api.californiapsychics.com/horoscope?format=json'
            //+ this.state.searchQuery, {
            + "&sign=" + this.state.sign + "&date=" + this.state.today, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response)=> response.json())
            .then((responseData)=> {

                var data = responseData[0];

                console.log(data.details);

                this.setState({
                    data: data,
                    showProgress: false
                });

            })
            .catch((error)=> {
                this.setState({
                    serverError: true
                });
            })
            .finally(()=> {
                this.setState({
                    //showProgress: false
                });
            });
    }

    render() {
        var image;

        switch (this.state.sign) {
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
                    justifyContent: 'center'
                }}>
                    <ActivityIndicator
                        size="large"
                        animating={true}/>
                </View>
            );
        }

        return (
            <ScrollView>
                <View style={{
                    flex: 1,
                    //padding: 10,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 65,
                    marginBottom: 65
                }}>

                    {errorCtrl}

                    {image}

                    <Text style={styles.welcome1}>
                         {this.state.name}'s horoscope on {this.state.todayDate}
                    </Text>

                    <Text style={styles.welcome}>
                        {this.state.data.details.scope}
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
                        style={styles.loginInput}
                        value={this.state.sign}
                        placeholder="Sign">
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

                    <TouchableHighlight
                        onPress={()=> this.localStorageInsert()}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableHighlight>

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
        height: 300,
        width: 300,
        borderRadius: 20,
        margin: 20
    },
    welcome: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
    },
    welcome1: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold'
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
        padding: 4,
        margin: 5,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 0,
        color: 'black'
    },
    descriptionInput: {
        height: 150,
        padding: 4,
        margin: 5,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 0,
        color: 'black'
    },
    button: {
        height: 50,
        margin: 5,
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

export default FriendsDetails;
