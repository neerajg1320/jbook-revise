import './cell-list.css';
import {Fragment, useEffect} from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import CellListItem from "./cell-list-item/cell-list-item";
import AddCell from "./add-cell/add-cell";
import {useActions} from "../../hooks/use-actions";

const CellList: React.FC = () => {
    const cells = useTypedSelector(({cells:{data, order}}) => {
        return order.map(id => {
            return data[id];
        })
    });

    const { fetchCells } = useActions();

    useEffect(() => {
        fetchCells();
    }, []);

    const renderedCells = cells.map(cell => (
        <Fragment key={cell.id}>
            <CellListItem cell={cell}/>
            <AddCell prevCellId={cell.id} forceVisible={false} />
        </Fragment>
    ))

    return (
        <div className="cell-list">
            <AddCell prevCellId={null} forceVisible={cells.length === 0} />
            <div>
                {renderedCells}
            </div>
        </div>
    );
}

export default CellList;
