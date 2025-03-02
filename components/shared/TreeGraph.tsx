import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface TreeNode {
    title: string;
    children?: TreeNode[];
}

const TreeGraph = ({ treeData, maxDepth }: { treeData: TreeNode, maxDepth: number }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!treeData || !svgRef.current) return;

        const dim = {
            width: window.innerWidth,
            height: window.innerHeight * (maxDepth * 2),
            margin: 50
        };

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${dim.width} ${dim.height}`)

        const rootNode = d3.hierarchy<TreeNode>(treeData, (d) => d.children);
        const layout = d3.tree<TreeNode>().size([dim.height - 50, dim.width - 320]);
        layout(rootNode);

        const g = svg.append("g").attr("transform", "translate(140,50)");

        // Draw links
        g.selectAll("path")
            .data(rootNode.links())
            .join("path")
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("d", d3.linkHorizontal()
                .x((d: any) => d.y)
                .y((d: any) => d.x)
            );

        g.selectAll("foreignObject")
            .data(rootNode.descendants())
            .join("foreignObject")
            .attr("x", (d: any) => d.y + 10)
            .attr("y", (d: any) => d.x - 10)
            .attr("width", 150)
            .attr("height", 40)
            .html((d: any) => `
                <a href="${d.data.url || '#'}" target="_blank">
                    <div style="
                        background: #1b1b1f;
                        color: orange;
                        padding: 5px 10px;
                        border: 1px solid orange;
                        border-radius: 5px;
                        font-size: 25px;
                        text-align: center;
                        cursor: pointer;
                    ">
                        ${d.data.title}
                    </div>
                </a>
            `);

    }, [treeData]);

    return <svg ref={svgRef} width="100%" height={`${(maxDepth + 1)*1000}px`}></svg>;
};

export default TreeGraph;