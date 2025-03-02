"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import TreeGraph from "./TreeGraph";
import { ScrollBar } from "../ui/scroll-area";
import Image from "next/image";
import { getCrawlData } from "@/lib/actions";

export interface ILink {
    id: string;
    url: string;
    title: string;
    depth: number;
    parent_id: string | null;
}

export interface ITreeNode extends ILink {
    children: ITreeNode[];
}

const buildTreeLayout = (flatData: ILink[]) => {
    const idToNodeMap: { [key: string]: ITreeNode } = {};
    let root = null;

    flatData.forEach((node) => {
        idToNodeMap[node.id] = { ...node, children: [] };
    });

    flatData.forEach((node) => {
        if (node.parent_id === null) {
            root = idToNodeMap[node.id];
        } else {
            idToNodeMap[node.parent_id]?.children.push(idToNodeMap[node.id]);
        }
    });

    console.log(root)

    return root;
};

export default function MainPage() {
    const [url, setUrl] = useState("");
    const [depth, setDepth] = useState<number>(1);
    const [data, setData] = useState<ILink[]>([]);
    const [treeRoot, setTreeRoot] = useState<ITreeNode | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCrawl = async () => {
        setLoading(true);
        const crawledData = await getCrawlData(url, depth)
        setData(crawledData)
        setLoading(false);
    };

    useEffect(() => {
        if (data.length > 0) {
            const tree = buildTreeLayout(data);
            setTreeRoot(tree);
        }
    }, [data]);

    return (
        <>
            <div className="flex flex-col items-center p-15 bg-[#1b1b1f] rounded-lg border-2 border-orange-400">
                <div className="flex flex-row justify-center items-center">
                    <Image src={'/crawler.png'} alt="crawler" height={70} width={70} />
                    <h1 className="text-2xl font-bold text-orange-400">Web Crawler Tree</h1>
                </div>
                <input
                    className="border p-2 mb-2 w-80 rounded-sm border-orange-400 text-white"
                    type="text"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <input
                    className="border p-2 mb-2 w-80 rounded-sm border-orange-400 text-white"
                    type="number"
                    min="1"
                    placeholder="Max Depth"
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                />
                <button
                    className="bg-orange-400 text-black font-bold p-2 rounded mt-2"
                    onClick={handleCrawl}
                    disabled={loading}
                >
                    {loading ? "Crawling..." : "Start Crawling"}
                </button>
            </div>

            <ScrollArea style={{ width: "1500px" }}>
                <div className="w-[1500px] border-2 border-orange-400 rounded-lg">
                    {treeRoot && <TreeGraph treeData={treeRoot} maxDepth={depth} />}
                </div>
                <ScrollBar orientation="horizontal" hidden={true} />
            </ScrollArea>
        </>
    );
}
