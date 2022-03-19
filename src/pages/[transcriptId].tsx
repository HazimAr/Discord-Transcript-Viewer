import { Client } from "@notionhq/client";
import { GetServerSidePropsContext } from "next";

const notion = new Client({
	auth: process.env.NOTION_TOKEN,
});

export default function Home({ transcriptHtml }) {
	return (
		<div
			id="transcript"
			dangerouslySetInnerHTML={{ __html: transcriptHtml }}
		></div>
	);
}

export async function getServerSideProps({
	params,
}: GetServerSidePropsContext) {
	const textArray = 
	(
		await notion.blocks.children.list({
			block_id: params.transcriptId as string,
		})
	// @ts-ignore
	).results[0].code.rich_text;

	console.log(textArray);
	return {
		props: {
			transcriptHtml: textArray
				.map((textObj) => {
					return textObj.plain_text;
				})
				.join(""),
		},
	};
}
