/* tslint:disable no-any no-unused-expression */

import {expect} from 'chai';
import * as React from 'react';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {ServerRenderer, ServerResponse} from '../ServerRenderer';
import {ComponentData, ResourceComponent} from '../component/ResourceComponent';
import {Container} from '../di/Container';
import {identity} from '../rootDecorator';
import {Cache} from '../store/Cache';

describe('ServerRenderer', () => {
  it('should render component', () => {
    class Test extends ResourceComponent<any, any> {
      public renderBody(): React.ReactElement<any> {
        return (
          <span>
            {this.getResource().text}
          </span>
        );
      }
    }

    const cache = new Cache();

    const props = {text: 'hi'};
    const container = new Container(
      cache,
      {
        async loadComponent(
          component: ResourceComponent<any, any>,
          path: string
        ): Promise<ComponentData> {
          component.changedResource(path, props);

          return {
            dialog: null,
            transform: {
              children: [],
              props
            }
          };
        }
      } as any
    );

    const registry: RootComponentRegistry = {
      rootDecorator: identity,
      getComponent(resourceType: string): any {
        return Test;
      }
    } as any;

    const renderer: ServerRenderer = new ServerRenderer(registry, container);

    const response: ServerResponse = renderer.renderReactComponent(
      '/test',
      '/components/test',
      'disabled'
    );

    expect(response.html).to.equal('<span data-reactroot="">hi</span>');
  });

  it('should throw error if component is not found', () => {
    const registry: RootComponentRegistry = {
      rootDecorator: identity,
      getComponent(resourceType: string): any {
        return null;
      }
    } as any;

    const renderer: ServerRenderer = new ServerRenderer(registry, null);

    let error = false;

    try {
      renderer.renderReactComponent('/test', '/components/test', 'disabled');
    } catch (e) {
      error = true;
    }

    expect(error).to.be.true;
  });
});
