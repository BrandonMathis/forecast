const expect = require('chai').expect
const colorFor = require('./colorFor')

describe('colorFor', () => {
  it('gives the proper color for a temp', (done) => {
    expect(colorFor(0, 'us')).to.eq('#E3F9FE');
    expect(colorFor(12, 'us')).to.eq('#C0F8FF');
    expect(colorFor(24, 'us')).to.eq('#87CEEB');
    expect(colorFor(34, 'us')).to.eq('#00BFFF');
    expect(colorFor(44, 'us')).to.eq('#4169E1');
    expect(colorFor(54, 'us')).to.eq('#008B8B');
    expect(colorFor(64, 'us')).to.eq('#008000');
    expect(colorFor(74, 'us')).to.eq('#32CD32');
    expect(colorFor(84, 'us')).to.eq('#7CFC00');
    expect(colorFor(94, 'us')).to.eq('#FFA500');
    expect(colorFor(104, 'us')).to.eq('#FF4500');
    expect(colorFor(114, 'us')).to.eq('#FF0000');
    done();
  });

  it('does not get tripped up by floats', (done) => {
    expect(colorFor(64.7, 'us')).to.eq('#008000');
    done();
  });
});
