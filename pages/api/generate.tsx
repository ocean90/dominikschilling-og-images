import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

export const config = {
	runtime: 'edge',
};

const interFont = fetch( new URL( '../../assets/fonts/Inter-Regular.ttf', import.meta.url ) ).then(
	(res) => res.arrayBuffer(),
);
const sourceSerif4Font = fetch( new URL( '../../assets/fonts/SourceSerif4-Regular.ttf', import.meta.url ) ).then(
	(res) => res.arrayBuffer(),
);

export default async function handler(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	if ( ! searchParams.has( 'title' ) ) {
		return new Response( 'Missing title', { status: 400 } );
	}

	const [ interFontData, sourceSerif4FontData ] = await Promise.all( [
		interFont,
		sourceSerif4Font,
	] );

	const title = searchParams.get( 'title' );
	const tags = searchParams.get( 'tags' )?.split( ',' ) || [];
	const width = searchParams.has( 'w' ) ? parseInt( searchParams.get( 'w' ) as string, 10 ) : 1200;
	const height = searchParams.has( 'h' ) ? parseInt( searchParams.get( 'h' ) as string, 10 ) : 630;

	try {
		return new ImageResponse(
			(
				<div
					style={{
						color: '#fff',
						background: '#132945',
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						padding: "80px 100px",
					}}
				>
					<div
						style={{
							display: 'flex',
							flexWrap: 'nowrap',
							alignItems: 'center',
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FFAC33" d="M34.347 16.893l-8.899-3.294-3.323-10.891c-.128-.42-.517-.708-.956-.708-.439 0-.828.288-.956.708l-3.322 10.891-8.9 3.294c-.393.146-.653.519-.653.938 0 .418.26.793.653.938l8.895 3.293 3.324 11.223c.126.424.516.715.959.715.442 0 .833-.291.959-.716l3.324-11.223 8.896-3.293c.391-.144.652-.518.652-.937 0-.418-.261-.792-.653-.938z"></path><path fill="#FFCC4D" d="M14.347 27.894l-2.314-.856-.9-3.3c-.118-.436-.513-.738-.964-.738-.451 0-.846.302-.965.737l-.9 3.3-2.313.856c-.393.145-.653.52-.653.938 0 .418.26.793.653.938l2.301.853.907 3.622c.112.444.511.756.97.756.459 0 .858-.312.97-.757l.907-3.622 2.301-.853c.393-.144.653-.519.653-.937 0-.418-.26-.793-.653-.937zM10.009 6.231l-2.364-.875-.876-2.365c-.145-.393-.519-.653-.938-.653-.418 0-.792.26-.938.653l-.875 2.365-2.365.875c-.393.146-.653.52-.653.938 0 .418.26.793.653.938l2.365.875.875 2.365c.146.393.52.653.938.653.418 0 .792-.26.938-.653l.875-2.365 2.365-.875c.393-.146.653-.52.653-.938 0-.418-.26-.792-.653-.938z"></path></svg>
						<div
							style={{
								display: 'flex',
								fontFamily: 'SourceSerif',
								fontSize: 30,
								marginLeft: 20,
							}}
						>Dominik Schilling</div>
					</div>
					<h1
						style={{
							fontFamily: 'Inter',
							display: 'flex',
							fontWeight: 400,
							fontStyle: 'normal',
							fontSize: 70,
							marginTop: 60,
						}}
					>{ title }</h1>
					{ tags.length > 0 && (
						<div
							style={{
								fontFamily: 'SourceSerif',
								fontSize: 30,
								display: 'flex',
								marginTop: 'auto',
							}}
						>
							{ tags.join( ', ' ) }
						</div>
					) }
				</div>
			),
			{
				width,
				height,
				fonts: [
					{
						name: 'Inter',
						data: interFontData,
						weight: 400,
						style: 'normal',
					},
					{
						name: 'SourceSerif',
						data: sourceSerif4FontData,
						weight: 400,
						style: 'normal',
					},
				],
			},
		);
	} catch ( e: any ) {
		console.log( `${e.message}` );
		return new Response( 'Failed to generate the image', {
			status: 500,
		} );
	}
}
