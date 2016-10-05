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

class HoroscopeDetails extends Component {
    constructor(props) {
        super(props);

        var d = new Date;
        var todayDate = d.getMonth() + 1 + '/' + (d.getDate()) + '/' + d.getFullYear();
        var today = d.getMonth() + 1 + '/' + (d.getDate());

        this.state = {
            showProgress: true,
            todayDate: todayDate,
            today: today,
            pushEvent: {
                details: {}
            }
        };

        console.log(this.props.pushEvent);

        this.getHoroscope();
    }

    getHoroscope() {
        fetch('http://m-api.californiapsychics.com/horoscope?format=json'
            //+ this.state.searchQuery, {
            + "&sign=" + this.props.pushEvent.name + "&date=" + this.state.today, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response)=> response.json())
            .then((responseData)=> {

                var data = responseData[0];

                console.log(data.details.scope)

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
        // var image = <View />;
        //
        // if (this.state.pushEvent.artworkUrl100) {
        //     image = <Image
        //         source={{uri: this.state.pushEvent.artworkUrl100.replace('100x100bb.jpg', '500x500bb.jpg')}}
        //         style={{
        //             height: 300,
        //             width: 200,
        //             borderRadius: 20,
        //             margin: 20
        //         }}
        //     />;
        // } else {
        //     image = <Image
        //         source={{uri: this.state.pushEvent.pic}}
        //         style={{
        //             height: 300,
        //             width: 200,
        //             borderRadius: 20,
        //             margin: 20
        //         }}
        //     />;
        // }

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
            <ScrollView>
                <View style={{
                    flex: 1,
                    //paddingTop: 20,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 65,
                    //marginBottom: 45
                }}>
                    {errorCtrl}

                    <Image source={require('../../../img/Aries.jpg')}
                           style={{
                               height: 300,
                               width: 300,
                               borderRadius: 20,
                               margin: 20
                           }}/>
                    {/*<Image*/}
                    {/*source={{uri: this.state.pushEvent.pic}}*/}
                    {/*style={{*/}
                    {/*height: 300,*/}
                    {/*width: 200,*/}
                    {/*borderRadius: 20,*/}
                    {/*margin: 20*/}
                    {/*}}*/}
                    {/*/>*/}

                    <Text style={styles.welcome}>
                        {this.state.data.signName} on {this.state.todayDate}
                    </Text>


                    <Text style={styles.welcome}>
                        {this.state.data.details.scope}
                    </Text>


                    <Text style={{
                        fontSize: 16,
                        padding: 20,
                        textAlign: 'justify'
                    }}>
                        {this.state.data.longDescription}
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
    welcome: {
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

export default HoroscopeDetails;
