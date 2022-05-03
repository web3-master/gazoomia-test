import { Card, Image, List } from "antd";
import "./MarketItem.css";

const MarketItem = ({ nft }) => {
  const onClick = () => {
    //navigate("/detail/" + nft.id);
  };

  return (
    <List.Item onClick={onClick}>
      <Card
        hoverable
        cover={
          <div style={{ height: "300px", overflow: "hidden" }}>
            <Image
              src={`https://ipfs.infura.io/ipfs/${nft.image.replace(
                "ipfs://",
                ""
              )}`}
              preview={false}
            />
          </div>
        }
        bodyStyle={{ paddingLeft: 10, paddingRight: 10, paddingTop: 20 }}
      >
        <Card.Meta title={`BORED APE #${nft.id}`} />
      </Card>
    </List.Item>
  );
};

export default MarketItem;
