import React from 'react';
// import Tree from 'antd/lib/tree'
import Tree from './MyTree';
import Icon from 'antd/lib/icon'
import 'antd/lib/tree/style/css';

const { TreeNode } = Tree;

class TabTreeView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rootNode: this.props.rootNode
        }
        const onTabUpdated = (tabId, changeInfo, tab) => {
            let rootNode = this.state.rootNode;
            if (changeInfo.title) {
                rootNode.setTitleById(tabId, changeInfo.title);
                this.setState({
                    rootNode: rootNode
                });
            }
            if (changeInfo.favIconUrl) {
                rootNode.setFavIconUrlById(tabId, changeInfo.favIconUrl);
                this.setState({
                    rootNode: rootNode
                });
            }
            
            if (changeInfo.status) {
                rootNode.setStatusById(tabId, changeInfo.status);
                this.setState({
                    rootNode: rootNode
                });
            }
            console.log(changeInfo);
        }
        this.props.chrome.tabs.onUpdated.addListener(onTabUpdated);
    }

    renderChildren(tNode) {
        if (tNode.children.length === 0) {
            return null;
        }
        return tNode.children.map((child) => {
            return this.renderTabTreeNode(child);
        })
    }

    renderTabTreeNode(tNode) {
        return (
            <TreeNode
                tabId={tNode.tab.id}
                title={this.getTitle(tNode)}
                icon={this.getIcon(tNode)}
            >
                {this.renderChildren(tNode)}
            </TreeNode>
        );

    }

    getTitle(tNode) {
        return tNode.tab.title ? tNode.tab.title : 'loading...'
    }

    getIcon(tNode) {
        if ((!tNode.tab.favIconUrl && !tNode.tab.status) || tNode.tab.status === 'loading') {
            return (
                <Icon type="loading" />
            )
        }
        return (
            <img width="16px" src={tNode.tab.favIconUrl} alt="" />
        );
    }

    render() {

        const treeNodeOnClick = (selectedKeys, e) => {
            this.props.chrome.tabs.update(e.node.props.tabId, {
                active: true
            })
        }

        const highligthCurrentTabNode = (node) => {
            return node.props.tabId === this.props.activeTabId;
        }

        return (
            <Tree
                showIcon={true}
                defaultExpandAll={true}
                showLine
                defaultExpandedKeys={['0-0-0']}
                onSelect={treeNodeOnClick}
                filterTreeNode={highligthCurrentTabNode}
            >
                {this.renderChildren(this.state.rootNode)}
            </Tree>
        );
    }
}

export default TabTreeView;