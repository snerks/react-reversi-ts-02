// import * as React from 'react';
// import { shallow } from 'enzyme';
// import * as renderer from 'react-test-renderer';
// // import {} = require('jest');

// import GamePage from './GamePage';
// import GameBoard from './GameBoard';

// describe('GamePage', () => {
//     const _component = shallow(
//         <GamePage />
//     );

//     it('renders and matches our snapshot', () => {
//         const component = renderer.create(
//             <GamePage />
//         );
//         const tree = component.toJSON();
//         expect(tree).toMatchSnapshot();
//     });

//     it('contains a GameBoard subcomponent', () => {
//         expect(_component.find(GameBoard)).toHaveLength(1);
//     });

//     // it('contains the same number of HelloWorld components as greetings', () => {
//     //     const helloWorldCount = _component.find(HelloWorld).length;
//     //     const greetingCount = (_component.state('greetings') as string[]).length;
//     //     expect(helloWorldCount).toEqual(greetingCount);
//     // });

//     // it('adds another greeting when the add greeting function is called', () => {
//     //     const beforeHelloWorldCount = _component.find(HelloWorld).length;

//     //     (_component.instance() as HelloWorldList).addGreeting('Sample');

//     //     const afterHelloWorldCount = _component.find(HelloWorld).length;
//     //     expect(afterHelloWorldCount).toBeGreaterThan(beforeHelloWorldCount);
//     // });

//     // it('removes a greeting from the list when the remove greeting function is called', () => {
//     //     const beforeHelloWorldCount = _component.find(HelloWorld).length;

//     //     const removeGreetingName = (_component.state('greetings') as string[])[0];
//     //     (_component.instance() as HelloWorldList).removeGreeting(removeGreetingName);

//     //     const afterHelloWorldCount = _component.find(HelloWorld).length;
//     //     expect(afterHelloWorldCount).toBeLessThan(beforeHelloWorldCount);
//     // });
// });