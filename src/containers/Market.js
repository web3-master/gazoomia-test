import { ControlOutlined, TableOutlined } from "@ant-design/icons";
import {
  Alert,
  Card,
  Checkbox,
  Col,
  Collapse,
  List,
  Row,
  Skeleton,
} from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { useContext, useEffect, useState } from "react";
import MarketItem from "../components/MarketItem";
import CollectionContext from "../web3/store/collection-context";
import Web3Context from "../web3/store/web3-context";

const Market = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const [items, setItems] = useState([]);

  const [earrings, setEarrings] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [furs, setFurs] = useState([]);
  const [clothes, setClothes] = useState([]);
  const [mouths, setMouths] = useState([]);
  const [eyes, setEyes] = useState([]);
  const [hats, setHats] = useState([]);

  const [filterChanged, setFilterChanged] = useState(0);

  useEffect(() => {
    setItems(collectionCtx.collection);

    var _earrings = [];
    var _backgrounds = [];
    var _furs = [];
    var _clothes = [];
    var _mouths = [];
    var _eyes = [];
    var _hats = [];

    for (let i = 0; i < collectionCtx.collection.length; i++) {
      const nft = collectionCtx.collection[i];

      if (nft.earring != "") {
        const existingValues = _earrings.filter((e) => e.value == nft.earring);
        if (existingValues.length == 0) {
          _earrings = [
            ..._earrings,
            { value: nft.earring, count: 1, checked: false },
          ];
        } else {
          existingValues[0].count = existingValues[0].count + 1;
        }
      }

      if (nft.background != "") {
        const existingValues = _backgrounds.filter(
          (e) => e.value == nft.background
        );
        if (existingValues.length == 0) {
          _backgrounds = [
            ..._backgrounds,
            { value: nft.background, count: 1, checked: false },
          ];
        } else {
          existingValues[0].count = existingValues[0].count + 1;
        }
      }

      if (nft.fur != "") {
        const existingValues = _furs.filter((e) => e.value == nft.fur);
        if (existingValues.length == 0) {
          _furs = [..._furs, { value: nft.fur, count: 1, checked: false }];
        } else {
          existingValues[0].count = existingValues[0].count + 1;
        }
      }

      if (nft.clothes != "") {
        const existingValues = _clothes.filter((e) => e.value == nft.clothes);
        if (existingValues.length == 0) {
          _clothes = [
            ..._clothes,
            { value: nft.clothes, count: 1, checked: false },
          ];
        } else {
          existingValues[0].count = existingValues[0].count + 1;
        }
      }

      if (nft.mouth != "") {
        const existingValues = _mouths.filter((e) => e.value == nft.mouth);
        if (existingValues.length == 0) {
          _mouths = [
            ..._mouths,
            { value: nft.mouth, count: 1, checked: false },
          ];
        } else {
          existingValues[0].count = existingValues[0].count + 1;
        }
      }

      if (nft.eyes != "") {
        const existingValues = _eyes.filter((e) => e.value == nft.eyes);
        if (existingValues.length == 0) {
          _eyes = [..._eyes, { value: nft.eyes, count: 1, checked: false }];
        } else {
          existingValues[0].count = existingValues[0].count + 1;
        }
      }

      if (nft.hat != "") {
        const existingValues = _hats.filter((e) => e.value == nft.hat);
        if (existingValues.length == 0) {
          _hats = [..._hats, { value: nft.hat, count: 1, checked: false }];
        } else {
          existingValues[0].count = existingValues[0].count + 1;
        }
      }
    }

    setEarrings(_earrings);
    setBackgrounds(_backgrounds);
    setFurs(_furs);
    setClothes(_clothes);
    setMouths(_mouths);
    setEyes(_eyes);
    setHats(_hats);
  }, [web3Ctx, collectionCtx]);

  useEffect(() => {
    var _earrings = getCheckedTraitValues(earrings);
    var _backgrounds = getCheckedTraitValues(backgrounds);
    var _furs = getCheckedTraitValues(furs);
    var _clothes = getCheckedTraitValues(clothes);
    var _mouths = getCheckedTraitValues(mouths);
    var _eyes = getCheckedTraitValues(eyes);
    var _hats = getCheckedTraitValues(hats);

    var result = [];
    result = collectionCtx.collection.filter((nft) => {
      var earringContained = false;
      if (_earrings.length == 0) {
        earringContained = true;
      } else {
        earringContained = _earrings.includes(nft.earring);
      }

      var backgroundContained = false;
      if (_backgrounds.length == 0) {
        backgroundContained = true;
      } else {
        backgroundContained = _backgrounds.includes(nft.background);
      }

      var furContained = false;
      if (_furs.length == 0) {
        furContained = true;
      } else {
        furContained = _furs.includes(nft.fur);
      }

      var clothesContained = false;
      if (_clothes.length == 0) {
        clothesContained = true;
      } else {
        clothesContained = _clothes.includes(nft.clothes);
      }

      var mouthContained = false;
      if (_mouths.length == 0) {
        mouthContained = true;
      } else {
        mouthContained = _mouths.includes(nft.mouth);
      }

      var eyeContained = false;
      if (_eyes.length == 0) {
        eyeContained = true;
      } else {
        eyeContained = _eyes.includes(nft.eyes);
      }

      var hatContained = false;
      if (_hats.length == 0) {
        hatContained = true;
      } else {
        hatContained = _hats.includes(nft.hat);
      }

      return (
        earringContained &&
        backgroundContained &&
        furContained &&
        clothesContained &&
        mouthContained &&
        eyeContained &&
        hatContained
      );
    });

    setItems(result);
  }, [filterChanged]);

  const getCheckedTraitValues = (traitValues) => {
    const checkedFilterValues = traitValues
      .filter((e) => e.checked)
      .map((e) => e.value);
    return checkedFilterValues;
  };

  const renderItem = (nft, key) => {
    if (Object.keys(nft).length == 0) {
      return (
        <List.Item>
          <Skeleton active />
        </List.Item>
      );
    } else {
      return <MarketItem nft={nft} />;
    }
  };

  const renderFilterBar = () => {
    return (
      <Col span={4}>
        <Card
          title={
            <span>
              <ControlOutlined style={{ marginRight: 10 }} />
              Filter
            </span>
          }
          bodyStyle={{ padding: 0 }}
        >
          <Collapse defaultActiveKey={[1]}>
            <CollapsePanel header="Earring" key={1}>
              {renderTraitFilter(earrings)}
            </CollapsePanel>
            <CollapsePanel header="Background" key={2}>
              {renderTraitFilter(backgrounds)}
            </CollapsePanel>
            <CollapsePanel header="Fur" key={3}>
              {renderTraitFilter(furs)}
            </CollapsePanel>
            <CollapsePanel header="Clothes" key={4}>
              {renderTraitFilter(clothes)}
            </CollapsePanel>
            <CollapsePanel header="Mouth" key={5}>
              {renderTraitFilter(mouths)}
            </CollapsePanel>
            <CollapsePanel header="Eyes" key={6}>
              {renderTraitFilter(eyes)}
            </CollapsePanel>
            <CollapsePanel header="Hat" key={7}>
              {renderTraitFilter(hats)}
            </CollapsePanel>
          </Collapse>
        </Card>
      </Col>
    );
  };

  const renderTraitFilter = (traitValues) => {
    return (
      <List dataSource={traitValues} renderItem={renderTraitFilterValueItem} />
    );
  };

  const renderTraitFilterValueItem = (item, key) => {
    return (
      <List.Item>
        <Checkbox
          onChange={(e) => {
            item.checked = e.target.checked;
            setFilterChanged(filterChanged + 1);
          }}
        >
          {item.value} ({item.count})
        </Checkbox>
      </List.Item>
    );
  };

  return (
    <Row style={{ margin: 20 }}>
      {collectionCtx.nftIsLoading && (
        <Col span={24}>
          <Alert message="Loading items..." type="info" showIcon />
        </Col>
      )}
      <Col span={24}>
        <Row gutter={10} style={{ marginTop: 10 }}>
          {renderFilterBar()}
          <Col span={20}>
            <Card
              title={
                <span>
                  <TableOutlined style={{ marginRight: 10 }} />
                  All Items
                </span>
              }
            >
              {collectionCtx.nftIsLoading ? (
                <Skeleton />
              ) : (
                <List
                  grid={{
                    gutter: 32,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 3,
                    xxl: 3,
                  }}
                  locale={{ emptyText: "There's nothing to show!" }}
                  dataSource={items}
                  renderItem={renderItem}
                  pagination={{
                    position: "bottom",
                    pageSize: 6,
                    total: items.length,
                    showTotal: (total) => `Total ${total} items`,
                  }}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Market;
