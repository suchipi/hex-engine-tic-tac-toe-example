import {
	useType,
	useNewComponent,
	Geometry,
	Vector,
	Polygon,
	SystemFont,
	Label,
	useDraw,
	Mouse,
} from "@hex-engine/2d";

export default function Cell({
	position,
	size,
	getContent,
	onClick,
}: {
	position: Vector;
	size: Vector;
	getContent: () => string;
	onClick?: () => void;
}) {
	useType(Cell);

	useNewComponent(() =>
		Geometry({
			shape: Polygon.rectangle(size),
			position,
		})
	);

	const font = useNewComponent(() =>
		SystemFont({ name: "sans-serif", size: size.y })
	);

	const label = useNewComponent(() => Label({ font }));

	useDraw((context) => {
		context.lineWidth = 1;
		context.strokeStyle = "black";
		context.strokeRect(0, 0, size.x, size.y);

		label.text = getContent();

		label.draw(context);
	});

	if (onClick) {
		const mouse = useNewComponent(Mouse);
		mouse.onClick(onClick);
	}
}
