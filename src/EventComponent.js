import React, { Component } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import {
    Container,
    Content,
    Card,
    CardItem,
    Thumbnail,
    Text,
    Button,
    Icon,
    Left,
    Body,
    Right
} from 'native-base';
import {
    Image,
    TouchableOpacity
} from 'react-native';
import BackService from '../services/api';

export default class EventComponent extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            previousPage:'',
            nextPage:''
        }
    };

    componentDidMount() {
        BackService.get("event/")
            .then(json => {this.setState({ events : json.results });
                           this.setState({ nextPage: json.links.next });
                           this.setState({ previousPage: json.links.previous })})
    }

    getStars(stars) {
        for(i =0; i < stars; i++){
            return (
                <Icon active name="star" />
            );
        }
    }
    _handleLoadMore = async () => {
        console.log("puxando ...");
        if (this.state.nextPage !== null){
            const response = await fetch(this.state.nextPage);
            const events = await response.json();
            
            this.setState({
                events: [...this.state.events, ...events.results],
                nextPage: events.links.next,
                previousPage: events.links.previous
            });

        }
      };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Content>
                    <FlatList
                    data={this.state.events}
                    renderItem={
                        ({ item }) =>
                        <TouchableOpacity key={item.id} onPress={() => navigate('EventDetail',{ eventDetail: item })}>
                            <Card key={item.id}>
                                <CardItem>
                                    <Left>
                                        <Thumbnail source={{ uri: 'http://192.168.1.37:8000/uploaded/' + item.image_file }} />
                                        <Body>
                                            <Text>{item.name}</Text>
                                            <Text note>{item.short_description}</Text>
                                        </Body>
                                    </Left>
                                </CardItem>
                                <CardItem cardBody>
                                    <Image source={{ uri: 'http://192.168.1.37:8000/uploaded/' + item.image_file }} style={{ height: 200, width: null, flex: 1 }} />
                                </CardItem>
                                <CardItem>
                                    <Left>
                                        <Button transparent>
                                            <Icon active ios="md-calendar" android="md-calendar" />
                                            <Text style={styles.textDate} >{item.date}</Text>
                                        </Button>
                                    </Left>
                                    <Button transparent>
                                        <Text style={styles.text}>{item.address.city.name}-{item.address.city.sigla}</Text>
                                    </Button>
                                </CardItem>
                            </Card>
                        </TouchableOpacity>
                    }
                    onEndReached={this._handleLoadMore}
                    onEndReachedThreshold={0.1}
                    keyExtractor={item => item.id_hash}
                    />
                </Content>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    text : {
        color: '#3f51b5',
        fontWeight: 'bold',
        fontSize: 14,
    },
    textDate : {
        color: '#3f51b5',
        fontWeight: 'bold',
        fontSize: 12,
    }
})