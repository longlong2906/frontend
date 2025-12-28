declare module 'react-plotly.js' {
  import { Component } from 'react';
  import { PlotParams } from 'plotly.js';

  interface PlotlyComponentProps {
    data: any[];
    layout?: any;
    config?: any;
    style?: React.CSSProperties;
    useResizeHandler?: boolean;
    onInitialized?: (figure: any, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: any, graphDiv: HTMLElement) => void;
    onPurge?: (figure: any, graphDiv: HTMLElement) => void;
    onError?: (err: Error) => void;
    divId?: string;
    className?: string;
    revision?: number;
    debug?: boolean;
    frames?: any[];
    onHover?: (event: any) => void;
    onUnhover?: (event: any) => void;
    onClick?: (event: any) => void;
    onSelected?: (event: any) => void;
    onRelayout?: (event: any) => void;
    onRestyle?: (event: any) => void;
    onRedraw?: () => void;
    onClickAnnotation?: (event: any) => void;
    onAfterExport?: () => void;
    onAfterPlot?: () => void;
    onAnimated?: () => void;
    onAnimatingFrame?: (event: any) => void;
    onAnimationInterrupted?: () => void;
    onAutoSize?: () => void;
    onBeforeExport?: () => void;
    onButtonClicked?: (event: any) => void;
    onDeselect?: () => void;
    onDoubleClick?: () => void;
    onFramework?: () => void;
    onLegendClick?: (event: any) => boolean;
    onLegendDoubleClick?: (event: any) => boolean;
    onSliderChange?: (event: any) => void;
    onSliderEnd?: (event: any) => void;
    onSliderStart?: (event: any) => void;
    onTransitioning?: () => void;
    onTransitionInterrupted?: () => void;
  }

  class Plot extends Component<PlotlyComponentProps> {}
  export default Plot;
}

