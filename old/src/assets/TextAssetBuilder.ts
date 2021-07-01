
import {ViewPort, Color} from "../utils";

import {
	Asset,
	AssetLoader,
	AssetType
} from '.';

export class  TextAssetBuilder {
	public constructor() {}

	public build (font: string, text: string, maxWidth: number, height: number, color: Color) : Asset {
		var textViewPort : ViewPort = new ViewPort();
		var textAsset : Asset = new Asset(AssetType.IMAGE);

		textViewPort.setFont(font);
		textViewPort.setColor(color || Color.fromString("green"));
		textViewPort.setTextBaseline("hanging");

		if (!maxWidth) {
			maxWidth = textViewPort.measureText(text).width;
		}

		textViewPort.setSize({width: maxWidth, height});
		// Something about setting the this a second time actually changes the way the text is drawn.
		textViewPort.setFont(font);
		textViewPort.setColor(color);
		textViewPort.setTextBaseline("hanging");

		textViewPort.drawText(text, 0, 0, maxWidth);

		textAsset.setData(textViewPort.getImage());

		// delete textViewPort;

		return textAsset;
	}
}