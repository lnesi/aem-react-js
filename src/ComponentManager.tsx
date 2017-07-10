import * as React from 'react';
import * as ReactDom from 'react-dom';
import {RootComponentRegistry} from './RootComponentRegistry';
import {RootComponent} from './component/RootComponent';
import {Container} from './di/Container';
import {Cache} from './store/Cache';

export interface ComponentTreeConfig {
  wcmmode: string;
  path: string;
  resourceType: string;
  cache: Cache;
}

/**
 * The Component
 */
export class ComponentManager {
  private container: Container;
  private document: Document;
  private registry: RootComponentRegistry;

  public constructor(
    registry: RootComponentRegistry,
    container: Container,
    aDocument?: Document
  ) {
    this.container = container;
    this.registry = registry;
    this.document = aDocument || document;
  }

  /**
   * initialize react component in dom.
   * @param item
   */
  public initReactComponent(item: any): void {
    const textarea = this.document.getElementById(
      item.getAttribute('data-react-id')
    ) as HTMLTextAreaElement;

    if (textarea) {
      const props: ComponentTreeConfig = JSON.parse(textarea.value);

      if (props.wcmmode === 'disabled') {
        const comp = this.registry.getComponent(props.resourceType);

        if (comp === null) {
          console.error(
            `React component '${props.resourceType}' ` +
              'does not exist in component list.'
          );
        } else {
          const cache: Cache = this.container.get('cache') as Cache;

          cache.mergeCache(props.cache);

          const ctx: any = {
            componentManager: this,
            container: this.container,
            registry: this.registry
          };

          ReactDom.render(
            <RootComponent
              aemContext={ctx}
              comp={comp}
              path={props.path}
              wcmmode={props.wcmmode}
            />,
            item
          );
        }
      }
    } else {
      console.error(
        `React config with id '${item.getAttribute('data-react-id')}' ` +
          'has no corresponding textarea element.'
      );
    }
  }

  public getResourceType(component: React.ComponentClass<any>): string {
    return this.registry.getResourceType(component);
  }

  public getComponent(resourceType: string): React.ComponentClass<any> {
    return this.registry.getComponent(resourceType);
  }

  /**
   * find all root elements and initialize the react components
   */
  public initReactComponents(): number {
    const items = [].slice.call(this.document.querySelectorAll('[data-react]'));

    for (const item of items) {
      this.initReactComponent(item);
    }

    return items.length;
  }
}