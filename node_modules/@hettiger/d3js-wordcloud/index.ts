import * as d3 from 'd3';
import * as cloud from 'd3-cloud';
import { Tag } from './tag.interface';
export { Tag } from './tag.interface';

d3.layout.cloud = cloud;

export class D3JsWordcloud {

    protected svg;

    protected vis;

    protected fill;

    protected layout;

    protected fontSize;

    constructor(
        protected targetElement: HTMLDivElement,
        protected tags: Tag[],
        protected ratio: number = 0.5625,
        protected fontFamily: string = 'impact',
        protected fontSizeRange: number[] = [8, 100],
    ) {
        this.init();
    }

    update(): void {
        this.layout.font(this.fontFamily).spiral('archimedean');
        this.fontSize = d3.scale['sqrt']().range(this.fontSizeRange);

        if (this.tags.length) {
            this.fontSize.domain([+this.tags[this.tags.length - 1].value || 1, +this.tags[0].value]);
        }

        this.layout.stop().words(this.tags).start();
    }

    protected init(): void {
        this.fill = d3.scale.category20b();
        const w = this.targetElement.parentElement.offsetWidth;
        const h = this.targetElement.parentElement.offsetWidth * this.ratio;

        this.layout = d3.layout.cloud()
            .timeInterval(Infinity)
            .size([w, h])
            .fontSize((d) => this.fontSize(+d.value))
            .text((d) => d.key)
            .on('end', this.draw.bind(this));

        this.svg = d3.select(this.targetElement).append('svg')
            .attr('width', w)
            .attr('height', h);

        this.vis = this.svg.append('g').attr('transform', 'translate(' + [w >> 1, h >> 1] + ')');

        this.update();

        if ((<any>window).attachEvent) {
            (<any>window).attachEvent('onresize', this.update.bind(this));
        } else if (window.addEventListener) {
            window.addEventListener('resize', this.update.bind(this));
        }
    }

    protected draw(data, bounds): void {
        const w = this.targetElement.parentElement.offsetWidth;
        const h = this.targetElement.parentElement.offsetWidth * this.ratio;
        this.svg.attr('width', w).attr('height', h);

        const scale = bounds ? Math.min(
            w / Math.abs(bounds[1].x - w / 2),
            w / Math.abs(bounds[0].x - w / 2),
            h / Math.abs(bounds[1].y - h / 2),
            h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

        const text = this.vis.selectAll('text').data(data, (d) => d.text.toLowerCase());

        text.transition()
            .duration(1000)
            .attr('transform', (d) => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
            .style('font-size', (d) => d.size + 'px');

        text.enter()
            .append('text')
            .style('opacity', 1e-6)
            .transition()
            .duration(1000)
            .attr('text-anchor', 'middle')
            .attr('transform', (d) => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
            .style('font-size', (d) => d.size + 'px')
            .style('opacity', 1);

        text.style('font-family', (d) => d.font)
            .style('fill', (d) => this.fill(d.text.toLowerCase()))
            .text((d) => d.text);

        this.vis.transition()
            .attr('transform', 'translate(' + [w >> 1, h >> 1] + ')scale(' + scale + ')');
    }
}
