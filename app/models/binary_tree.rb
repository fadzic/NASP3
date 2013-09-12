class BinaryTree

  class Node
    # binary tree representation
    attr_accessor :name, :children
    def initialize(name=nil, children=[nil, nil])
      @name, @children = name, children
    end
  end

  def insert(node, v, &block)
    # binary tree insert without balancing,
    # block performs the comparison operation
    return Node.new(v) if not node
    case block[v, node.name]
      when -1
        node.children[0] = insert(node.children[0], v, &block)
      when 1
        node.children[1] = insert(node.children[1], v, &block)
    end
    return node
  end

  def visit(n, order=:preorder, &block)
    # visit nodes in a binary tree, order can be determinied
    # block performs visit action
    return false unless (n != nil)

    case order
      when :preorder
        yield n.name
        visit(n.children[1], order, &block)
      when :inorder
        visit(n.children[0], order, &block)
        yield n.name
        visit(n.children[1], order, &block)
      when :postorder
        visit(n.children[0], order, &block)
        visit(n.children[1], order, &block)
        yield n.name
    end
  end
end
