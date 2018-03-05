const _ = require('lodash');

module.exports = function () {
  const exampleLocation = _.sample([
    'Paris, France',
    'Tokyo',
    'Durham',
    'Antarctica',
    '90210'
  ]);
  return `
*Get Weather*  
> \`/forecast ${exampleLocation}\` to get weather for location (try any place in the world)  
> \`/forecast ${exampleLocation} !us\` to get weather for location in specific units (us or si)  
*Settings*  
> \`/forecast set (si/us)\` to change units (\`si\` for metric, \`us\` for imperial)  
`;
}
