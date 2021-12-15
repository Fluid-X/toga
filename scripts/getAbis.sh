CONFIG="./config/abis.txt"
ABI_DIRECTORY="./node_modules/@superfluid-finance/ethereum-contracts/build/contracts"

while IFS= read -r abi
do
    cp "$ABI_DIRECTORY/$abi.json" "./abis/$abi.json"
done < "$CONFIG"

