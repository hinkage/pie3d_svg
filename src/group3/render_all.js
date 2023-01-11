import { normalize } from '../util';
import renderInner from './render_inner';
import renderOuter from './render_outer';
import renderTop from './render_top';

export default function renderAll(dataArray, cfg, opt) {
    dataArray = dataArray.map((d) => normalize(d));
    renderInner(dataArray, cfg, opt);
    renderOuter(dataArray, cfg, opt);
    renderTop(dataArray, cfg, opt);
}
