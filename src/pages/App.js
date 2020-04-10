import React,{Component, Suspense} from 'react';
import '../index.css';
import PropTypes from 'prop-types';
import Error from "../components/Error";
import Loader from "../components/Loader";

export class App extends Component {
  static propTypes = {
    children : PropTypes.node,
    loading : PropTypes.bool,
    curPath : PropTypes.string,
    error : PropTypes.objectOf(Error)
  }

  componentDidCatch(err, info) {
    this.props.actions.createError(err, info);
  }

  render() {
    if (this.props.error) {
      return (
        <div className="app">
          <Error error={this.props.error} />
        </div>
      );
    }
    return (
      <div className="app"> 
        <Suspense fallback = {Loader}>
          <main>{ this.props.children }</main>
        </Suspense>
      </div>
    );
  }
}