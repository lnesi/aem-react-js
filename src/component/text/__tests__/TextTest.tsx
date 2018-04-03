import {expect} from 'chai';
import * as enzyme from 'enzyme';
import * as React from 'react';
import {JsXssUtils} from '../../../xss/JsXssUtils';
import {Text} from '../Text';
import {TextPool} from '../TextPool';

/*tslint:disable-next-line*/
import '../../../test/setup';

describe('Text', () => {
  it('should render span with text', () => {
    const textPool = new TextPool();
    const xssUtils = new JsXssUtils();
    const aemContext = {
      container: {textPool, xssUtils}
    };
    const text = "<a>text</a><script>alert('hi')</script>";
    const item = enzyme.shallow(
      <Text value={text} element="span" className="test" context="html" />,
      {
        context: {aemContext, root: 'root'}
      }
    );

    expect(item.html()).to.equal(
      '<span class="test" id="text_root_0"><a>text</a></span>'
    );

    expect(textPool.getId(text)).to.equal('text_root_0');
  });
  it('should render span with context text', () => {
    const textPool = new TextPool();
    const xssUtils = new JsXssUtils();
    const aemContext = {
      container: {textPool, xssUtils}
    };
    const item = enzyme.shallow(
      <Text
        value="<a>text</a>"
        element="span"
        className="test"
        context="html"
      />,
      {
        context: {aemContext, root: 'root'}
      }
    );

    expect(item.html()).to.equal(
      '<span class="test" id="text_root_0"><a>text</a></span>'
    );

    expect(textPool.getId('<a>text</a>')).to.equal('text_root_0');
  });
});