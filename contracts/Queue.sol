// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * @title RenounceableQueue
 * @dev Doubly Linked List tweaked for performance. Only allows adding at the Head.
 * @author Alberto Cuesta Cañada
 */
contract RenounceableQueue {
  event ObjectCreated(uint256 id, address data);
  event ObjectRemoved(uint256 id);
  event NewHead(uint256 id);
  event NewTail(uint256 id);

  uint256 public head;
  uint256 public tail;
  address[] public objects;

  /**
   * @dev Creates an empty list.
   */
  constructor() {
    head = 0;
    tail = 0;
  }

  /**
   * @dev Returns the id of the next element, or 0 if `_id` refers to the Tail.
   */
  function next(uint256 _id) public view virtual returns (bool, uint256) {
    for (uint256 i = _id; i > tail; i--) {
      if (objects[i - 1] != address(0)) return (true, i - 1);
    }
    return (false, 0);
  }

  /**
   * @dev Returns the id of the previous element, or 0 if `_id` refers to the Head.
   */
  function prev(uint256 _id) public view virtual returns (bool, uint256) {
    for (uint256 i = _id; i < head; i++) {
      if (objects[i + 1] != address(0)) return (true, i + 1);
    }
    return (false, 0);
  }

  /**
   * @dev Retrieves the data of the element denoted by `_id`.
   */
  function get(uint256 _id) public view virtual returns (address) {
    return objects[_id];
  }

  /**
   * @dev Return the id of the first element that matches `_data`.
   */
  function find(address _data) public view virtual returns (bool, uint256) {
    uint256 i = tail;
    while (i <= head) {
      if (objects[i] == _data) return (true, i);
      else i += 1;
    }
    return (false, 0);
  }

  /**
   * @dev Insert a new element as the new Head containing `_data`.
   */
  function addHead(address _data) public virtual {
    objects.push(_data);
    head = objects.length - 1;
    emit ObjectCreated(head, _data);
    emit NewHead(head);
  }

  /**
   * @dev Remove the element denoted by `_id` from the List.
   */
  function remove(uint256 _id) public virtual {
    if (_id == head) {
      (, head) = next(head);
      emit NewHead(head);
    }
    if (_id == tail) {
      (, tail) = prev(tail);
      emit NewTail(tail);
    }
    delete objects[_id];
    emit ObjectRemoved(_id);
  }
}
