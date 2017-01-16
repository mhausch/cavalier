const initialState = {};
const reducer = function (state = initialState, action) {
  switch (action.type) {

    case 'all':
        console.log('test');

    default:
      return state;
  }
}
export default reducer;
