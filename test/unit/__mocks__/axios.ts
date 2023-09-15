// export default {
//     get: jest.fn(() => Promise.resolve({ data: [{
//         id: 0,
//         name: 'test axios1',
//         price: 123,
    
//     }, {
//         id: 1,
//         name: '2test axios1',
//         price: 223,
    
//     }, {
//         id: 3,
//         name: '3test axios1',
//         price: 323,
    
//     },
//     ] }))
// }

//альтернативный вариант
export default {
    get: jest.fn().mockResolvedValue({ data: {}})
}