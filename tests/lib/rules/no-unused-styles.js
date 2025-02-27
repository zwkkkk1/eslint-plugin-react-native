/**
 * @fileoverview No unused styles defined in javascript files
 * @author Tom Hastjarjanto
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-unused-styles');

require('@babel/eslint-parser');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const filename = require.resolve('../__mocks__/foo.js');
const ruleTester = new RuleTester();
const tests = {
  valid: [
    {
      filename,
      options: [{ enableImportsCheck: true }],
      code: `
    import { styles } from './valid-styles-export-const'
    import { myStyles as renamedStyles } from './valid-styles-export-rename-const'
    import styles2 from './valid-styles-export-default'
    import styles3 from './valid-styles-export-var-as-default'

    function Test(){
      return <View>
        <Text style={styles.name}>Mur</Text>
        <Text style={styles2.name}>Amur</Text>
        <Text style={styles3.name}>Sooqa</Text>
        <Text style={renamedStyles.name}>!</Text>
      </View>;
    }
    `,
    },
    {
      options: [{ enableImportsCheck: false }],
      code: `
    import { styles } from './styles.js'

    function Test(){
      return <Text style={styles.name}>Hi!</Text>;
    }
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        name: {}
      });
      const Hello = React.createClass({
        render: function() {
          return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    }, {
      code: `
      const Hello = React.createClass({
        render: function() {
          return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;
        }
      });
      const styles = StyleSheet.create({
        name: {}
      });
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        name: {}
      });
      const Hello = React.createClass({
        render: function() {
          return <Text style={styles.name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        name: {},
        welcome: {}
      });
      const Hello = React.createClass({
        render: function() {
          return <Text style={styles.name}>Hello {this.props.name}</Text>;
        }
      });
      const Welcome = React.createClass({
        render: function() {
          return <Text style={styles.welcome}>Welcome</Text>;
        }
      });
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        propTypes: {
          textStyle: Text.propTypes.style,
        },
        render: function() {
          return <Text style={[styles.text, textStyle]}>Hello {this.props.name}</Text>;
        }
      });
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const styles2 = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        propTypes: {
          textStyle: Text.propTypes.style,
        },
        render: function() {
          return (
            <Text style={[styles.text, styles2.text, textStyle]}>
             Hello {this.props.name}
            </Text>
           );
        }
      });
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        text: {}
      });
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true, condition2: true }; 
        },
        render: function() {
          return (
            <Text
              style={[
                this.state.condition &&
                this.state.condition2 &&
                styles.text]}>
              Hello {this.props.name}
            </Text>
          );
        }
      });
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        text: {},
        text2: {},
      });
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true }; 
        },
        render: function() {
          return (
            <Text style={[this.state.condition ? styles.text : styles.text2]}>
              Hello {this.props.name}
            </Text>
          );
        }
      });
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
          style1: {
              color: 'red',
          },
          style2: {
              color: 'blue',
          }
      });
      export default class MyComponent extends Component {
          static propTypes = {
              isDanger: PropTypes.bool
          };
          render() {
              return <View style={this.props.isDanger ? styles.style1 : styles.style2} />;
          }
      }
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
    `,
    }, {
      code: `
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true }; 
        },
        render: function() {
          const myStyle = this.state.condition ? styles.text : styles.text2;
          return (
              <Text style={myStyle}>
                  Hello {this.props.name}
              </Text>
          );
        }
      });
      const styles = StyleSheet.create({
        text: {},
        text2: {},
      });
    `,
    }, {
      code: `
      const additionalStyles = {};
      const styles = StyleSheet.create({
        name: {},
        ...additionalStyles
      });
      const Hello = React.createClass({
        render: function() {
          return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    }, {
      code: `
      const styles = OtherStyleSheet.create({
        name: {},
      });
      const Hello = React.createClass({
        render: function() {
          return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
  ],

  invalid: [
    {
      filename,
      options: [{ enableImportsCheck: true }],
      errors: [
        {
          message: 'Unused style detected: styles.label',
        },
        {
          message: 'Unused style detected: styles2.label',
        },
        {
          message: 'Unused style detected: styles3.label',
        },
        {
          message: 'Unused style detected: renamedStyles.label',
        },
      ],
      code: `
    import { styles } from './invalid-styles-export-const'
    import styles2 from './invalid-styles-export-default'
    import styles3 from './invalid-styles-export-var-as-default'
    import { myStyles as renamedStyles } from './invalid-styles-export-rename-const'

    function Test(){
      return <View>
        <Text style={styles.name}>Mur</Text>
        <Text style={styles2.name}>Amur</Text>
        <Text style={styles3.name}>Sooqa</Text>
        <Text style={renamedStyles.name}>!</Text>
      </View>;
    }
    `,
    }, {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        render: function() {
          return <Text style={styles.b}>Hello {this.props.name}</Text>;
        }
      });
    `,
      errors: [{
        message: 'Unused style detected: styles.text',
      }],
    }, {
      code: `
      const styles = StyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.Component {
        render() {
          return <View style={styles.foo}/>;
        }
      }
    `,
      errors: [{
        message: 'Unused style detected: styles.bar',
      }],
    }, {
      code: `
      const styles = StyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.PureComponent {
        render() {
          return <View style={styles.foo}/>;
        }
      }
    `,
      errors: [{
        message: 'Unused style detected: styles.bar',
      }],
    }, {
      code: `
      const styles = OtherStyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.PureComponent {
        render() {
          return <View style={styles.foo}/>;
        }
      }
    `,
      errors: [{
        message: 'Unused style detected: styles.bar',
      }],
    }, {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = () => (<><Text style={styles.b}>Hello</Text></>);
    `,
      errors: [{
        message: 'Unused style detected: styles.text',
      }],
    }],
};

const config = {
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: [
          ['estree', { classFeatures: true }],
          'jsx',
        ],
      },
    },
  },
  settings: {
    'react-native/style-sheet-object-names': ['StyleSheet', 'OtherStyleSheet'],
  },
};

tests.valid.forEach((t) => Object.assign(t, config));
tests.invalid.forEach((t) => Object.assign(t, config));

ruleTester.run('no-unused-styles', rule, tests);
