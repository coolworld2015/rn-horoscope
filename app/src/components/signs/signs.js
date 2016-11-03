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

import HoroscopeDetails from './horoscopeDetails';
import HoroscopeTomorrow from './horoscopeTomorrow';

class Signs extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            resultsCount: 0,
            showProgress: true
        };

        setTimeout(() => {
            this.setState({
                showProgress: true
            });
            this.getSignsList();
        }, 100);
    }

    getSignsList() {
        console.log('getSignsList');
        var arrSigns = [
            {
                name: 'Capricorn',
                interval: '12/22 - 01/19'
            },
            {
                name: 'Aquarius',
                interval: '01/20 - 02/18'
            },
            {
                name: 'Pisces',
                interval: '02/19 - 03/20'
            },
            {
                name: 'Aries',
                interval: '03/21 - 04/19'
            },
            {
                name: 'Taurus',
                interval: '04/20 - 05/20'
            },
            {
                name: 'Gemini',
                interval: '05/21 - 06/21'
            },
            {
                name: 'Cancer',
                interval: '06/22 - 07/22'
            },
            {
                name: 'Leo',
                interval: '07/23 - 08/22'
            },
            {
                name: 'Virgo',
                interval: '08/23 - 09/22'
            },
            {
                name: 'Libra',
                interval: '09/23 - 10/22'
            },
            {
                name: 'Scorpio',
                interval: '10/23 - 11/21'
            },
            {
                name: 'Sagittarius',
                interval: '11/22 - 12/21'
            }
        ];

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(arrSigns),
            resultsCount: arrSigns.length,
            responseData: this.state.dataSource.cloneWithRows(arrSigns),
            showProgress: false
        });
    }

    getHoroscope(rowData) {
        this.props.navigator.push({
            title: rowData.name,
            component: HoroscopeDetails,
            rightButtonTitle: 'Tomorrow',
            onRightButtonPress: () => {
                this.props.navigator.push({
                    title: rowData.name,
                    component: HoroscopeTomorrow,
                    rightButtonTitle: 'Back',
                    onRightButtonPress: () => {
                        this.props.navigator.popToTop(0)
                    },
                    passProps: {
                        pushEvent: rowData
                    }
                })
            },
            passProps: {
                pushEvent: rowData
            }
        });
    }

    pressRow(rowData) {
        this.getHoroscope(rowData);
    }

    renderRow(rowData) {
        var image;

        switch (rowData.name) {
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
                        <Text style={styles.text}>{rowData.interval}</Text>
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
                resultsCount: 0,
                searchQuery: ''
            });

            setTimeout(() => {
                //this.getSignsList();
                this.setState({
                    showProgress: false,
                    resultsCount: 12,
                    dataSource: this.state.responseData
                });
            }, 1000);
        }
    }

    onChangeText(text) {
        if (this.state.dataSource == undefined) {
            return;
        }
        var arr = [].concat(this.state.responseData);
        arr = arr[0]._dataBlob.s1;

        var items = arr.filter((el) => el.name.toLowerCase().indexOf(text.toLowerCase()) >= 0);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(items),
            resultsCount: items.length,
            searchQuery: text
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
                height: 100,
                backgroundColor: 'white'
            }}>
                <ActivityIndicator
                    size="large"
                    animating={true}/>
            </View>;
        }

        return (
            <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
                <View style={{marginTop: 60, backgroundColor: 'white'}}>
                    <TextInput style={{
                        height: 45,
                        marginTop: 4,
                        padding: 5,
                        borderWidth: 3,
                        borderColor: 'lightgray',
                        borderRadius: 0,
                        backgroundColor: 'white',
                        color: 'black'
                    }}
                               onChangeText={this.onChangeText.bind(this)}
                               value={this.state.searchQuery}
                               placeholderTextColor="gray"
                               placeholder="Search here">
                    </TextInput>

                    {errorCtrl}

                </View>

                {loader}

                <ScrollView style={{backgroundColor: 'white'}}
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
        backgroundColor: 'white'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    countFooter: {
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        borderColor: '#D7D7D7',
        backgroundColor: 'white',
        color: 'black'
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

export default Signs;
