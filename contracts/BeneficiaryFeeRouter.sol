// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BeneficiaryFeeRouter
 * @notice Acts as an immutable Doppler beneficiary that routes fees to a
 *         configurable recipient wallet.
 *
 * Because Doppler pool beneficiaries cannot be changed after pool creation,
 * this contract is deployed *before* the pool and set as the beneficiary.
 * The admin (owner) can later point it at the real recipient — e.g. the
 * token creator's wallet once they claim — and accumulated fees (WETH or
 * any ERC-20) can be forwarded on demand.
 *
 * Key properties:
 *   - Owner-controlled: only the owner can change the recipient or
 *     emergency-withdraw funds.
 *   - Permissionless forwarding: once a recipient is set, *anyone* can call
 *     `forward()` to push the balance to the recipient.
 *   - Supports both ERC-20 tokens and native ETH.
 */
contract BeneficiaryFeeRouter {
    // ── State ────────────────────────────────────────────────────────────

    address public owner;
    address public recipient;

    // ── Events ───────────────────────────────────────────────────────────

    event RecipientSet(address indexed previousRecipient, address indexed newRecipient);
    event FeesForwarded(address indexed token, address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ── Errors ───────────────────────────────────────────────────────────

    error NotOwner();
    error ZeroAddress();
    error NoRecipient();
    error NoBalance();
    error TransferFailed();

    // ── Modifiers ────────────────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // ── Constructor ──────────────────────────────────────────────────────

    constructor(address _owner) {
        if (_owner == address(0)) revert ZeroAddress();
        owner = _owner;
    }

    // ── Admin ────────────────────────────────────────────────────────────

    /**
     * @notice Set or update the recipient address for fee forwarding.
     * @param _recipient The address that should receive forwarded fees.
     */
    function setRecipient(address _recipient) external onlyOwner {
        if (_recipient == address(0)) revert ZeroAddress();
        address previous = recipient;
        recipient = _recipient;
        emit RecipientSet(previous, _recipient);
    }

    /**
     * @notice Transfer ownership of the router.
     * @param newOwner The new owner address.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        address previous = owner;
        owner = newOwner;
        emit OwnershipTransferred(previous, newOwner);
    }

    // ── Forwarding ───────────────────────────────────────────────────────

    /**
     * @notice Forward the entire balance of an ERC-20 token to the recipient.
     * @param token The ERC-20 token address to forward.
     */
    function forward(address token) external {
        if (recipient == address(0)) revert NoRecipient();

        // Use low-level call so we don't need an IERC20 import.
        (bool ok, bytes memory data) = token.staticcall(
            abi.encodeWithSignature("balanceOf(address)", address(this))
        );
        require(ok && data.length >= 32, "balanceOf failed");
        uint256 balance = abi.decode(data, (uint256));

        if (balance == 0) revert NoBalance();

        (bool success, bytes memory ret) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", recipient, balance)
        );
        require(
            success && (ret.length == 0 || abi.decode(ret, (bool))),
            "transfer failed"
        );

        emit FeesForwarded(token, recipient, balance);
    }

    /**
     * @notice Forward all accumulated native ETH to the recipient.
     */
    function forwardETH() external {
        if (recipient == address(0)) revert NoRecipient();
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoBalance();

        (bool success, ) = recipient.call{value: balance}("");
        if (!success) revert TransferFailed();

        emit FeesForwarded(address(0), recipient, balance);
    }

    // ── Emergency ────────────────────────────────────────────────────────

    /**
     * @notice Emergency withdraw any token or ETH. Owner only.
     * @param token ERC-20 token address, or address(0) for native ETH.
     * @param to    Destination address.
     */
    function emergencyWithdraw(address token, address to) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();

        if (token == address(0)) {
            uint256 balance = address(this).balance;
            (bool success, ) = to.call{value: balance}("");
            if (!success) revert TransferFailed();
            emit FeesForwarded(address(0), to, balance);
        } else {
            (bool ok, bytes memory data) = token.staticcall(
                abi.encodeWithSignature("balanceOf(address)", address(this))
            );
            require(ok && data.length >= 32, "balanceOf failed");
            uint256 balance = abi.decode(data, (uint256));

            (bool success, bytes memory ret) = token.call(
                abi.encodeWithSignature("transfer(address,uint256)", to, balance)
            );
            require(
                success && (ret.length == 0 || abi.decode(ret, (bool))),
                "transfer failed"
            );

            emit FeesForwarded(token, to, balance);
        }
    }

    // ── Receive ETH ──────────────────────────────────────────────────────

    receive() external payable {}
}
