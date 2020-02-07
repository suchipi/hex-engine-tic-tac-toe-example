import {
	useType,
	useNewComponent,
	Canvas,
	Grid,
	Vector,
	useChild,
	useDraw,
	SystemFont,
	Label,
} from "@hex-engine/2d";
import Cell from "./Cell";

export default function Root() {
	useType(Root);

	const canvas = useNewComponent(() => Canvas({ backgroundColor: "white" }));
	canvas.fullscreen({ pixelZoom: 1 });

	const grid = new Grid<string>(3, 3, " ");
	let state: "PLACING_X" | "PLACING_O" | "X_WON" | "O_WON" | "TIE" =
		"PLACING_X";

	function checkForWinCondition() {
		for (const [rowIndex, columnIndex, value] of grid.contents()) {
			if (value === "x" || value === "o") {
				const up = grid.get(rowIndex - 1, columnIndex);
				const down = grid.get(rowIndex + 1, columnIndex);

				const left = grid.get(rowIndex, columnIndex - 1);
				const right = grid.get(rowIndex, columnIndex + 1);

				const upLeft = grid.get(rowIndex - 1, columnIndex - 1);
				const upRight = grid.get(rowIndex - 1, columnIndex + 1);

				const downLeft = grid.get(rowIndex + 1, columnIndex - 1);
				const downRight = grid.get(rowIndex + 1, columnIndex + 1);

				if (
					(up === value && down === value) ||
					(left === value && right === value) ||
					(upLeft === value && downRight === value) ||
					(upRight === value && downLeft === value)
				) {
					state = value === "x" ? "X_WON" : "O_WON";
				}
			}
		}

		const allCells = [...grid.contents()].map(([row, column, value]) => value);
		if (
			allCells.every((value) => value !== " ") &&
			state !== "X_WON" &&
			state !== "O_WON"
		) {
			state = "TIE";
		}
	}

	const cellSize = new Vector(16, 16);
	const firstCellPosition = new Vector(100, 100);

	for (const [rowIndex, columnIndex] of grid.contents()) {
		useChild(() =>
			Cell({
				position: firstCellPosition
					.addX(cellSize.x * rowIndex)
					.addY(cellSize.y * columnIndex),
				size: cellSize,
				getContent: () => grid.get(rowIndex, columnIndex),
				onClick: () => {
					switch (state) {
						case "PLACING_X": {
							const content = grid.get(rowIndex, columnIndex);
							if (content === " ") {
								grid.set(rowIndex, columnIndex, "x");
								state = "PLACING_O";
							}
							break;
						}
						case "PLACING_O": {
							const content = grid.get(rowIndex, columnIndex);
							if (content === " ") {
								grid.set(rowIndex, columnIndex, "o");
								state = "PLACING_X";
							}
							break;
						}
					}

					checkForWinCondition();
				},
			})
		);
	}

	const font = useNewComponent(() =>
		SystemFont({ name: "sans-serif", size: 14 })
	);
	const stateLabel = useNewComponent(() => Label({ font }));

	useDraw((context) => {
		switch (state) {
			case "PLACING_X": {
				stateLabel.text = "X's turn";
				break;
			}
			case "PLACING_O": {
				stateLabel.text = "O's turn";
				break;
			}
			case "X_WON": {
				stateLabel.text = "X won";
				break;
			}
			case "O_WON": {
				stateLabel.text = "O won";
				break;
			}
			case "TIE": {
				stateLabel.text = "Tie game";
				break;
			}
		}

		stateLabel.draw(context);
	});
}
