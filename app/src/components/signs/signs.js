'use strict'

import React, { Component } from 'react';
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

import MoviesDetails from './moviesDetails';

class Signs extends Component {
    constructor(props){
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            searchQuery: props.searchQuery,
						resultsCount: 0
        };
    }

    componentWillMount() {
      this.getSignsList();
    }

    getSignsList() {
      var arrSigns = [
        {
          name: 'Aries',
          interval: '03/21 - 04/19',
          pic: './Aries.jpg'
        },
        {
          name: 'Taurus',
          interval: '04/20 - 05/20',
          pic: './Aries.jpg'
        }
      ];

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(arrSigns),
        resultsCount: arrSigns.length,
        responseData: arrSigns
      });
    }

    pressRow(rowData){
        this.props.navigator.push({
            title: rowData.trackName,
            component: MoviesDetails,
            rightButtonTitle: 'Delete',
            onRightButtonPress: () => {
              Alert.alert(
                'Delete',
                'Are you sure you want to delete ' + rowData.trackName + '?',
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                  {text: 'OK', onPress: () => {
                    this.deleteMovie(rowData.trackId);
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

    renderRow(rowData){
        var image = <View />;

        switch (rowData.name) {
          case 'Aries':
            image = <Image
                    source={require('../../../img/Aries.jpg')}
                    style={{
                      height: 115,
                      width: 105,
                      borderRadius: 20,
                      margin: 20
                      }}
                  />;
            break;

            case 'Taurus':
              image = <Image
                      source={require('../../../img/Taurus.jpg')}
                      style={{
                        height: 115,
                        width: 105,
                        borderRadius: 20,
                        margin: 20
                        }}
                    />;
              break;
          }

        return (
          	<TouchableHighlight
                onPress={()=> this.pressRow(rowData)}
                underlayColor='#ddd'
          	>

            <View style={styles.imgsList}>

              {image}

              <View style={{
                 flex: 1,
                 flexDirection: 'column',
                 justifyContent: 'space-between'
                }}>
                  <Text>{rowData.name}</Text>
                  <Text>{rowData.interval}</Text>
              </View>

            </View>
          </TouchableHighlight>
        );
    }

    refreshData(event){
      if (event.nativeEvent.contentOffset.y <= -100) {
        setTimeout(() => {this.getSignsList()}, 300);
      }
    }

    render(){
      var errorCtrl = <View />;

        if(this.state.serverError){
            errorCtrl = <Text style={styles.error}>
                Something went wrong.
            </Text>;
        }

      if(this.state.showProgress){
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}>
                <ActivityIndicator
                    size="large"
                    animating={true} />
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
            if (this.state.responseData == undefined) {
              return;
            }
					  var arr = [].concat(this.state.responseData);
					  var items = arr.filter((el) => el.name.indexOf(text) >= 0);
					  this.setState({
						 dataSource: this.state.dataSource.cloneWithRows(items),
						 resultsCount: items.length,
					  })
          }}
          placeholder="Search here">
              </TextInput>

          	{errorCtrl}

            </View>

          <ScrollView
            onScroll={this.refreshData.bind(this)} scrollEventThrottle={16}
            style={{marginTop: 0, marginBottom: 0}}>
            <ListView
              style={{marginTop: -65, marginBottom: 0}}
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
    img: {
      height: 95,
      width: 75,
      borderRadius: 20,
      margin: 20
    },
    error: {
      color: 'red',
      paddingTop: 10,
      textAlign: 'center'
    }
});

module.exports = Signs;
