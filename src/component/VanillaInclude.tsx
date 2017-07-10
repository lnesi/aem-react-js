import * as React from 'react';
import {AemComponent} from './AemComponent';

export interface VanillaProps {
  component: React.ComponentClass<any>;
  path: string;
}

export class VanillaInclude extends AemComponent<VanillaProps, any> {
  public render(): React.ReactElement<any> {
    const componentClass = this.getRegistry().getVanillaWrapper(
      this.props.component
    );

    return React.createElement(componentClass, {path: this.props.path});
  }
}