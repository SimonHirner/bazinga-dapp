import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import Marketplace from '../../ethereum/marketplace';

class ArtworkBuy extends Component {
  static async getInitialProps() {
    const marketplaceAddress = await factory.methods.marketplace().call()
    
    return { marketplaceAddress };
  }

  state = {
    artworkName: '',
    artworkUrl: ''
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.requestAccounts();

      await Marketplace(this.props.marketplaceAddress).methods.registerArtwork(this.state.artworkName, this.state.artworkUrl)
      .send({from: accounts[0], value: 10});

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Artwork</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Artwork Name</label>
            <Input
              label="Name"
              labelPosition="right"
              value={this.state.artworkName}
              onChange={event =>
                this.setState({ artworkName: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Artwork URL</label>
            <Input
              label="URL"
              labelPosition="right"
              value={this.state.artworkUrl}
              onChange={event =>
                this.setState({ artworkUrl: event.target.value })}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default ArtworkBuy;