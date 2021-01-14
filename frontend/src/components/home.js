import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import axios from 'axios'

export class Home extends Component {

  state = {
    transactions: [],
    isLoading: true,
    errors: null,
    activeKey: 1
  }

  componentDidMount() {
    this.fetchTransactions();
  }
  fetchTransactions() {
    const url = 'http://localhost:4040/api/transactions'
    axios.get(url)
      .then(({ data }) => {
        const transactions = data
        this.setState({ transactions, isLoading: false })
      })
      .catch(err => console.log({ err }))
  }

  render() {
    const { isLoading, transactions } = this.state;
    return (
      
      <Accordion defaultActiveKey="0">
        <h3>Transactions</h3> 
        <hr />
        {!isLoading ? (
            transactions.map((transaction) => {
              const { id, amount, type } = transaction;
              return (
                <Card bg={type === 'debit' ? 'danger': 'success'} text="white">
                  <Accordion.Toggle as={Card.Header} eventKey={id}>
                  {type}: {type === 'debit' ? `-${amount}`: amount}$
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={id}>
                    <Card.Body>
                    <ul className="">
                      {Object.keys(transaction).map(key => <li>{key}: {transaction[key]}</li>)}
                    </ul>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            })
          ) : (
            <p>Loading...</p>
          )}
      </Accordion>
    );
  }
}

