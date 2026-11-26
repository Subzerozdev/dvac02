/*
 * Dữ liệu học DVA-C02.
 * phrases: [en, vi, mẹo nhớ, câu ví dụ EN (phải chứa cụm en), nghĩa câu ví dụ]
 * formulas: khuôn câu hay gặp trong đề + ví dụ
 * signals: [cụm từ trong đề, hướng đáp án, giải thích]
 * Muốn thêm từ: chỉ cần thêm 1 dòng vào đúng nhóm.
 */
window.DATA = {
  categories: {
    exam: { name: 'Cụm từ trong đề', icon: '📝' },
    dev: { name: 'Phát triển (Domain 1)', icon: '🛠️' },
    sec: { name: 'Bảo mật (Domain 2)', icon: '🔐' },
    deploy: { name: 'Triển khai (Domain 3)', icon: '🚀' },
    ops: { name: 'Gỡ lỗi & Tối ưu (Domain 4)', icon: '🔍' },
    formula: { name: 'Công thức câu', icon: '📐' },
    signal: { name: 'Tín hiệu đề', icon: '🎯' }
  },

  phrases: {
    exam: [
      ['meet these requirements', 'đáp ứng các yêu cầu này', 'meet = "gặp" → gặp đúng điều đề muốn = đáp ứng. Có trong gần như MỌI câu hỏi.', 'Which solution will meet these requirements?', 'Giải pháp nào sẽ đáp ứng các yêu cầu này?'],
      ['least operational overhead', 'ít công sức vận hành nhất', 'overhead = gánh nặng "trên đầu". LEAST overhead → ưu tiên dịch vụ managed/serverless, không phải tự cài đặt, vá lỗi.', 'Which solution meets the requirements with the least operational overhead?', 'Giải pháp nào đáp ứng yêu cầu với ít công sức vận hành nhất?'],
      ['most cost-effective', 'tiết kiệm chi phí nhất', 'cost (chi phí) + effective (hiệu quả). Gặp cụm này → chọn trả tiền theo mức dùng, tắt tài nguyên khi rảnh.', 'What is the most cost-effective way to store the logs?', 'Cách lưu log tiết kiệm chi phí nhất là gì?'],
      ['with minimal code changes', 'với ít thay đổi code nhất', 'minimal = tối thiểu. → Ưu tiên bật cấu hình/tính năng có sẵn thay vì viết lại ứng dụng.', 'The developer must add caching with minimal code changes.', 'Developer phải thêm caching với ít thay đổi code nhất.'],
      ['least development effort', 'ít công sức phát triển nhất', 'effort = công sức. Development effort = công viết code. → Chọn tính năng có sẵn của dịch vụ.', 'Which approach requires the least development effort?', 'Cách tiếp cận nào cần ít công sức phát triển nhất?'],
      ['highly available', 'có tính sẵn sàng cao', 'available = sẵn có → hệ thống "lúc nào cũng có mặt". Thường gắn với Multi-AZ.', 'The application must be highly available across multiple Availability Zones.', 'Ứng dụng phải có tính sẵn sàng cao trên nhiều Availability Zone.'],
      ['fault-tolerant', 'chịu được lỗi', 'fault = lỗi, tolerant = chịu đựng → một phần hỏng mà hệ thống vẫn chạy.', 'The team needs a fault-tolerant design for the order service.', 'Nhóm cần một thiết kế chịu lỗi cho dịch vụ đặt hàng.'],
      ['scale automatically', 'tự động mở rộng/thu hẹp', 'scale = co giãn quy mô. Đi kèm Auto Scaling, Lambda, DynamoDB on-demand.', 'The API must scale automatically during peak hours.', 'API phải tự động mở rộng trong giờ cao điểm.'],
      ['decouple', 'tách rời (giảm phụ thuộc)', 'de (bỏ) + couple (cặp đôi) → "chia tay" giữa các thành phần. Gặp từ này → nghĩ ngay SQS / SNS / EventBridge.', 'Use a queue to decouple the web tier from the processing tier.', 'Dùng hàng đợi để tách rời tầng web khỏi tầng xử lý.'],
      ['near real-time', 'gần thời gian thực', 'near = gần. Dữ liệu được xử lý chỉ sau vài giây. Hay gặp với Kinesis, DynamoDB Streams.', 'The dashboard must display orders in near real-time.', 'Dashboard phải hiển thị đơn hàng gần như theo thời gian thực.'],
      ['at rest', 'khi lưu trữ (dữ liệu nằm yên)', 'rest = nghỉ → dữ liệu "nằm nghỉ" trên ổ đĩa. Encryption at rest = mã hóa dữ liệu lưu trữ (KMS).', 'All data must be encrypted at rest.', 'Tất cả dữ liệu phải được mã hóa khi lưu trữ.'],
      ['in transit', 'khi đang truyền', 'transit = quá cảnh, đang di chuyển. Encryption in transit = dùng TLS/HTTPS.', 'Data in transit must be protected with TLS.', 'Dữ liệu đang truyền phải được bảo vệ bằng TLS.'],
      ['on-premises', 'tại chỗ (máy chủ riêng của công ty)', 'premises = cơ sở, trụ sở. Ngược lại với "in the cloud".', 'The company is moving an on-premises application to AWS.', 'Công ty đang chuyển một ứng dụng tại chỗ lên AWS.'],
      ['without managing servers', 'không cần quản lý máy chủ', 'Cụm này = gợi ý SERVERLESS: Lambda, Fargate, DynamoDB, API Gateway.', 'The team wants to run code without managing servers.', 'Nhóm muốn chạy code mà không cần quản lý máy chủ.'],
      ['hard-coded credentials', 'thông tin đăng nhập ghi cứng trong code', 'hard-coded = "đóng cứng" trong code. Luôn là ĐIỀU XẤU → thay bằng IAM role hoặc Secrets Manager.', 'The application currently uses hard-coded credentials to access the database.', 'Ứng dụng hiện dùng thông tin đăng nhập ghi cứng để truy cập database.'],
      ['intermittently', 'thỉnh thoảng, chập chờn', 'inter (giữa) + mittent → lúc có lúc không. Lỗi chập chờn thường do throttling hoặc timeout.', 'Users intermittently receive 502 errors.', 'Người dùng thỉnh thoảng nhận lỗi 502.'],
      ['spikes in traffic', 'lưu lượng tăng đột biến', 'spike = cái gai nhọn → biểu đồ vọt lên như gai. → Cần auto scaling, hàng đợi để đệm.', 'The website experiences spikes in traffic during sales events.', 'Website gặp lưu lượng tăng đột biến trong các đợt khuyến mãi.'],
      ['unpredictable', 'khó đoán trước', 'un (không) + predict (dự đoán) + able. Traffic khó đoán → on-demand / serverless.', 'The workload is unpredictable, so the team chooses on-demand capacity.', 'Khối lượng công việc khó đoán nên nhóm chọn on-demand capacity.'],
      ['in the event of', 'trong trường hợp (xảy ra)', 'event = sự kiện. "In the event of a failure" = nếu xảy ra sự cố.', 'The data must be recoverable in the event of a Region failure.', 'Dữ liệu phải khôi phục được trong trường hợp một Region gặp sự cố.'],
      ['choose two', 'chọn hai đáp án', 'Câu hỏi nhiều đáp án! Đọc kỹ: TWO = 2, THREE = 3.', 'Which steps should the developer take? (Choose two.)', 'Developer nên thực hiện những bước nào? (Chọn hai.)'],
      ['most likely cause', 'nguyên nhân có khả năng nhất', 'likely = có khả năng. Dạng câu hỏi troubleshooting: tìm nguyên nhân.', 'What is the most likely cause of the timeout errors?', 'Nguyên nhân có khả năng nhất của lỗi timeout là gì?'],
      ['which combination of steps', 'kết hợp những bước nào', 'combination = sự kết hợp. Luôn đi kèm "(Choose TWO/THREE)".', 'Which combination of steps will resolve the issue?', 'Kết hợp những bước nào sẽ giải quyết sự cố?'],
      ['troubleshoot', 'tìm và khắc phục sự cố', 'trouble (rắc rối) + shoot (bắn) → "bắn hạ rắc rối".', 'The developer must troubleshoot the failed deployment.', 'Developer phải tìm và khắc phục lỗi của lần triển khai thất bại.'],
      ['ensure that', 'đảm bảo rằng', 'ensure ≈ make sure. Phía sau là điều BẮT BUỘC phải đạt.', 'The developer must ensure that only authenticated users can call the API.', 'Developer phải đảm bảo rằng chỉ người dùng đã xác thực mới gọi được API.'],
      ['comply with', 'tuân thủ', 'comply → compliance (sự tuân thủ). Thường đi với quy định bảo mật, kiểm toán.', 'The company must comply with strict security regulations.', 'Công ty phải tuân thủ các quy định bảo mật nghiêm ngặt.'],
      ['exactly once', 'đúng một lần', 'exactly = chính xác. Xử lý đúng một lần → SQS FIFO.', 'Each payment must be processed exactly once.', 'Mỗi khoản thanh toán phải được xử lý đúng một lần.'],
      ['at least once', 'ít nhất một lần', 'SQS Standard đảm bảo gửi ít nhất một lần → có thể nhận trùng → code phải idempotent. Khi đứng trước danh từ thì có gạch nối: at-least-once delivery.', 'SQS standard queues deliver each message at least once.', 'Hàng đợi SQS standard gửi mỗi message ít nhất một lần.'],
      ['in the order', 'theo đúng thứ tự', 'order = thứ tự (cũng có nghĩa "đơn hàng"!). In the order they are sent = theo thứ tự gửi → FIFO.', 'Messages must be processed in the order that they are sent.', 'Message phải được xử lý theo đúng thứ tự gửi.'],
      ['retrieve', 'truy xuất, lấy về', 're (lại) + trieve (tìm) → tìm lấy lại. Retrieve a secret = lấy secret ra.', 'The function must retrieve the database password at startup.', 'Function phải lấy mật khẩu database khi khởi động.'],
      ['at runtime', 'lúc chạy (khi ứng dụng đang chạy)', 'runtime = thời gian chạy. Ngược với "hard-coded" (cố định sẵn trong code).', 'Load the configuration at runtime instead of storing it in the code.', 'Tải cấu hình lúc chạy thay vì lưu trong code.'],
      ['existing application', 'ứng dụng hiện có', 'exist = tồn tại → existing = đang có sẵn. Thường đi với "minimal code changes".', 'The company wants to add monitoring to an existing application.', 'Công ty muốn thêm giám sát cho một ứng dụng hiện có.'],
      ['downtime', 'thời gian ngừng hoạt động', 'down (sập) + time. "No downtime" → blue/green, rolling, immutable.', 'The update must be deployed with no downtime.', 'Bản cập nhật phải được triển khai mà không bị ngừng hoạt động.'],
      ['a large number of', 'một số lượng lớn', '"a large number of + danh từ số nhiều". Gợi ý: cần scale, batch, queue.', 'The application receives a large number of requests every minute.', 'Ứng dụng nhận một số lượng lớn request mỗi phút.'],
      ['securely store', 'lưu trữ một cách an toàn', 'securely = một cách an toàn. Gặp với password/API key → Secrets Manager / Parameter Store SecureString.', 'The developer needs to securely store API keys.', 'Developer cần lưu trữ API key một cách an toàn.'],
      ['granular', 'chi tiết, ở mức nhỏ', 'grain = hạt → chia nhỏ như hạt. "Granular permissions" = phân quyền chi tiết.', 'The team needs granular access control for each table.', 'Nhóm cần kiểm soát truy cập chi tiết cho từng bảng.'],
      ['upload directly from', 'tải lên trực tiếp từ', 'directly = trực tiếp (không qua server). Upload trực tiếp từ trình duyệt lên S3 → presigned URL.', 'The web app must upload directly from the browser to Amazon S3.', 'Web app phải tải lên trực tiếp từ trình duyệt lên Amazon S3.'],
      ['management overhead', 'công sức quản lý (≈ operational overhead)', 'Đề hay đổi cách nói: operational overhead = management overhead = administrative effort. Cùng một ý: ít phải tự quản lý.', 'The company wants to reduce the management overhead of its servers.', 'Công ty muốn giảm công sức quản lý máy chủ.'],
      ['out of the box', 'có sẵn ngay, không cần cấu hình thêm', 'Như đồ mới "lấy ra khỏi hộp" là dùng được ngay. Tính năng có sẵn → thường là đáp án ít công sức.', 'DynamoDB provides encryption at rest out of the box.', 'DynamoDB có sẵn mã hóa khi lưu trữ mà không cần cấu hình thêm.'],
      ['transient errors', 'lỗi tạm thời (tự hết)', 'transient = thoáng qua. Lỗi tạm thời (throttling, mạng chập chờn) → thử lại với exponential backoff.', 'The SDK retries transient errors automatically.', 'SDK tự động thử lại các lỗi tạm thời.'],
      ['stale data', 'dữ liệu cũ (chưa cập nhật)', 'stale = ôi, cũ (như bánh mì để lâu). Cache có thể trả về dữ liệu cũ → dùng TTL hoặc write-through.', 'Users sometimes see stale data from the cache.', 'Người dùng đôi khi thấy dữ liệu cũ từ cache.'],
      ['offload', 'giảm tải (chuyển bớt việc sang nơi khác)', 'off (ra khỏi) + load (tải) → dỡ bớt tải. Offload reads = chuyển bớt request đọc sang cache / read replica.', 'Use ElastiCache to offload read requests from the database.', 'Dùng ElastiCache để giảm tải các request đọc khỏi database.'],
      ['gradually', 'dần dần', 'gradual = từ từ. "Shift traffic gradually" → canary / linear deployment.', 'The team wants to shift traffic to the new version gradually.', 'Nhóm muốn chuyển lưu lượng sang phiên bản mới một cách dần dần.']
    ],

    dev: [
      ['idempotent', 'lũy đẳng (gọi nhiều lần, kết quả như một lần)', 'idem (giống nhau) + potent → gọi 1 lần hay 10 lần kết quả vẫn y hệt. Cần khi message có thể bị gửi trùng.', 'The Lambda function must be idempotent because messages can be delivered more than once.', 'Lambda function phải lũy đẳng vì message có thể được gửi nhiều hơn một lần.'],
      ['eventually consistent read', 'đọc nhất quán cuối cùng', 'eventually = rốt cuộc → dữ liệu mới SẼ xuất hiện, nhưng có thể chậm một chút. Mặc định của DynamoDB, tốn 0.5 RCU / 4 KB.', 'By default, DynamoDB uses an eventually consistent read.', 'Mặc định, DynamoDB dùng đọc nhất quán cuối cùng.'],
      ['strongly consistent read', 'đọc nhất quán mạnh', 'strongly = mạnh → luôn đọc được bản mới nhất. Tốn gấp đôi RCU (1 RCU / 4 KB). Bật bằng ConsistentRead = true.', 'Use a strongly consistent read to always get the latest data.', 'Dùng đọc nhất quán mạnh để luôn lấy dữ liệu mới nhất.'],
      ['partition key', 'khóa phân vùng', 'partition = vách ngăn. DynamoDB băm (hash) partition key để chia dữ liệu ra các phân vùng.', 'Choose a partition key with many distinct values.', 'Chọn khóa phân vùng có nhiều giá trị khác nhau.'],
      ['sort key', 'khóa sắp xếp', 'sort = sắp xếp. Partition key + sort key = khóa chính tổng hợp; cho phép Query theo khoảng (begins_with, between).', 'Use the order date as the sort key.', 'Dùng ngày đặt hàng làm khóa sắp xếp.'],
      ['hot partition', 'phân vùng "nóng" (bị truy cập dồn dập)', 'hot = nóng → quá nhiều request dồn vào một phân vùng → bị throttle. Sửa: chọn partition key phân tán hơn.', 'A poorly chosen key caused a hot partition in the table.', 'Một khóa chọn kém đã gây ra phân vùng nóng trong bảng.'],
      ['high cardinality', 'nhiều giá trị khác nhau (độ phân tán cao)', 'cardinal = số đếm. High cardinality (vd: userId) → dữ liệu phân bố đều → partition key tốt.', 'A partition key with high cardinality distributes traffic evenly.', 'Partition key có nhiều giá trị khác nhau sẽ phân bổ lưu lượng đều.'],
      ['global secondary index', 'chỉ mục phụ toàn cục (GSI)', 'global = toàn cục → partition key KHÁC bảng gốc, tạo được bất cứ lúc nào, chỉ hỗ trợ eventually consistent.', 'Create a global secondary index to query orders by customer email.', 'Tạo chỉ mục phụ toàn cục để truy vấn đơn hàng theo email khách hàng.'],
      ['local secondary index', 'chỉ mục phụ cục bộ (LSI)', 'local = cục bộ → CÙNG partition key, khác sort key. Chỉ tạo được LÚC TẠO BẢNG.', 'A local secondary index must be created when the table is created.', 'Chỉ mục phụ cục bộ phải được tạo khi tạo bảng.'],
      ['provisioned throughput', 'thông lượng được cấp phát trước', 'provision = chuẩn bị sẵn. Bạn tự đặt RCU/WCU. Vượt quá → ProvisionedThroughputExceededException.', 'The table ran out of provisioned throughput during the sale.', 'Bảng đã dùng hết thông lượng cấp phát trong đợt khuyến mãi.'],
      ['on-demand capacity', 'dung lượng theo nhu cầu', 'on-demand = theo yêu cầu → trả tiền theo từng request, tự co giãn. Hợp với traffic khó đoán.', 'Switch the table to on-demand capacity for unpredictable traffic.', 'Chuyển bảng sang dung lượng theo nhu cầu cho lưu lượng khó đoán.'],
      ['exponential backoff', 'thử lại với thời gian chờ tăng theo cấp số nhân', 'back off = lùi lại. Chờ 1s, 2s, 4s, 8s... rồi mới thử lại. Đáp án kinh điển cho lỗi throttling.', 'Implement retries with exponential backoff.', 'Triển khai thử lại với thời gian chờ tăng theo cấp số nhân.'],
      ['jitter', 'độ trễ ngẫu nhiên', 'jitter = rung lắc → thêm chút ngẫu nhiên vào thời gian chờ để các client không thử lại cùng lúc.', 'Add jitter to the retry delay to avoid synchronized retries.', 'Thêm độ trễ ngẫu nhiên vào thời gian chờ để tránh các lần thử lại đồng loạt.'],
      ['dead-letter queue', 'hàng đợi thư chết (DLQ)', 'dead letter = thư không gửi được. Message lỗi quá maxReceiveCount lần sẽ bị chuyển vào đây để phân tích.', 'Configure a dead-letter queue to capture messages that fail processing.', 'Cấu hình hàng đợi thư chết để giữ lại các message xử lý thất bại.'],
      ['visibility timeout', 'thời gian ẩn message', 'visibility = khả năng nhìn thấy. Khi 1 consumer nhận message, nó bị "ẩn" với consumer khác trong khoảng này. Quá ngắn → xử lý trùng.', 'Increase the visibility timeout so that messages are not processed twice.', 'Tăng thời gian ẩn message để message không bị xử lý hai lần.'],
      ['long polling', 'thăm dò dài', 'long = dài → chờ tối đa 20 giây đến khi có message. Giảm phản hồi rỗng và chi phí. Bật bằng ReceiveMessageWaitTimeSeconds > 0.', 'Enable long polling to reduce empty responses from the queue.', 'Bật thăm dò dài để giảm phản hồi rỗng từ hàng đợi.'],
      ['fan out', 'phát tán (một → nhiều)', 'fan = cái quạt → xòe ra nhiều hướng. Mẫu: 1 SNS topic → nhiều SQS queue. Ngữ pháp: động từ viết "fan out" (không gạch nối), danh từ/tính từ viết "fan-out" (the fan-out pattern).', 'Use an SNS topic to fan out messages to multiple SQS queues.', 'Dùng SNS topic để phát tán message tới nhiều hàng đợi SQS.'],
      ['FIFO queue', 'hàng đợi vào trước ra trước', 'First-In-First-Out → giữ đúng thứ tự, chống trùng. Tên queue phải kết thúc bằng .fifo.', 'Use an SQS FIFO queue to keep messages in order.', 'Dùng hàng đợi SQS FIFO để giữ message theo thứ tự.'],
      ['message group ID', 'mã nhóm message', 'group = nhóm. Trong FIFO, các message cùng group ID được xử lý theo thứ tự.', 'Messages with the same message group ID are processed in order.', 'Các message có cùng mã nhóm được xử lý theo thứ tự.'],
      ['deduplication ID', 'mã chống trùng lặp', 'de (bỏ) + duplicate (bản sao) → loại bản trùng trong khoảng 5 phút (SQS FIFO).', 'The producer sends a deduplication ID with each message.', 'Producer gửi một mã chống trùng lặp kèm theo mỗi message.'],
      ['cold start', 'khởi động lạnh', 'cold = lạnh → môi trường Lambda chưa "ấm", phải khởi tạo từ đầu → request đầu tiên chậm.', 'Provisioned concurrency reduces cold start latency.', 'Provisioned concurrency giảm độ trễ khởi động lạnh.'],
      ['reserved concurrency', 'số lượng chạy đồng thời dành riêng', 'reserve = đặt trước. Vừa ĐẢM BẢO vừa GIỚI HẠN số instance tối đa của 1 function. Đặt = 0 → chặn function.', 'Set reserved concurrency to limit how many instances the function can run.', 'Đặt reserved concurrency để giới hạn số instance function có thể chạy.'],
      ['provisioned concurrency', 'chạy đồng thời cấp phát trước (giữ sẵn bản ấm)', 'provisioned = chuẩn bị sẵn → môi trường đã khởi tạo sẵn → không cold start. Có tính phí.', 'Enable provisioned concurrency to eliminate cold starts.', 'Bật provisioned concurrency để loại bỏ khởi động lạnh.'],
      ['event source mapping', 'ánh xạ nguồn sự kiện', 'Lambda tự "kéo" (poll) dữ liệu từ SQS, Kinesis, DynamoDB Streams rồi gọi function theo lô.', 'Create an event source mapping between the SQS queue and the function.', 'Tạo ánh xạ nguồn sự kiện giữa hàng đợi SQS và function.'],
      ['asynchronous invocation', 'gọi bất đồng bộ', 'a (không) + synchronous (đồng bộ) → gọi xong đi luôn, không chờ kết quả. S3, SNS gọi Lambda kiểu này; tự thử lại 2 lần.', 'S3 uses asynchronous invocation to trigger the function.', 'S3 dùng cách gọi bất đồng bộ để kích hoạt function.'],
      ['synchronous invocation', 'gọi đồng bộ', 'syn (cùng) + chronos (thời gian) → chờ kết quả trả về. API Gateway gọi Lambda kiểu này.', 'API Gateway uses synchronous invocation and waits for the response.', 'API Gateway dùng cách gọi đồng bộ và chờ phản hồi.'],
      ['execution role', 'vai trò thực thi', 'execute = thực thi. IAM role mà Lambda "mang" khi chạy, quyết định function được gọi dịch vụ nào.', 'Add the s3:GetObject permission to the function execution role.', 'Thêm quyền s3:GetObject vào vai trò thực thi của function.'],
      ['environment variables', 'biến môi trường', 'Lưu cấu hình ngoài code (tên bảng, endpoint). Thông tin nhạy cảm → mã hóa bằng KMS hoặc dùng Secrets Manager.', 'Store the table name in environment variables.', 'Lưu tên bảng trong biến môi trường.'],
      ['Lambda layer', 'lớp Lambda (gói thư viện dùng chung)', 'layer = lớp. Đóng gói thư viện / runtime dùng chung cho nhiều function, tối đa 5 layer.', 'Package the shared libraries as a Lambda layer.', 'Đóng gói các thư viện dùng chung thành một Lambda layer.'],
      ['presigned URL', 'URL ký sẵn (cấp quyền tạm thời)', 'pre (trước) + signed (đã ký) → link có chữ ký + thời hạn. Cho người không có tài khoản AWS tải lên/xuống S3.', 'Generate a presigned URL so users can download the file for 15 minutes.', 'Tạo URL ký sẵn để người dùng tải file trong 15 phút.'],
      ['multipart upload', 'tải lên nhiều phần', 'multi (nhiều) + part (phần). Nên dùng với file > 100 MB, bắt buộc với file > 5 GB.', 'Use multipart upload for files larger than 100 MB.', 'Dùng tải lên nhiều phần cho file lớn hơn 100 MB.'],
      ['time to live', 'thời gian sống (TTL)', 'TTL → DynamoDB tự xóa item khi hết hạn (thuộc tính epoch seconds), không tốn WCU.', 'Enable time to live to delete expired sessions automatically.', 'Bật TTL để tự động xóa các phiên đã hết hạn.'],
      ['conditional write', 'ghi có điều kiện', 'condition = điều kiện. Chỉ ghi khi điều kiện đúng (ConditionExpression), vd: attribute_not_exists.', 'Use a conditional write to prevent overwriting an existing item.', 'Dùng ghi có điều kiện để tránh ghi đè lên item đã tồn tại.'],
      ['optimistic locking', 'khóa lạc quan', 'optimistic = lạc quan → "tin là ít xung đột", dùng số version; nếu version đã đổi thì cập nhật thất bại.', 'Use optimistic locking with a version number attribute.', 'Dùng khóa lạc quan với thuộc tính số phiên bản.'],
      ['lazy loading', 'tải lười (chỉ nạp cache khi cần)', 'lazy = lười → chỉ nạp vào cache khi cache miss. Ưu: chỉ cache dữ liệu được đọc. Nhược: dữ liệu có thể cũ.', 'With lazy loading, data is written to the cache only after a cache miss.', 'Với tải lười, dữ liệu chỉ được ghi vào cache sau một lần cache miss.'],
      ['write-through', 'ghi xuyên (ghi DB thì ghi cache luôn)', 'write through = ghi xuyên qua → mỗi lần ghi DB cũng cập nhật cache → cache luôn mới.', 'A write-through strategy keeps the cache data current.', 'Chiến lược ghi xuyên giữ dữ liệu cache luôn mới.'],
      ['cache hit', 'trúng cache', 'hit = trúng. Dữ liệu có sẵn trong cache → trả về nhanh. Ngược lại: cache miss (trượt).', 'A high cache hit ratio reduces database load.', 'Tỷ lệ trúng cache cao giúp giảm tải database.'],
      ['stateless', 'phi trạng thái', 'state (trạng thái) + less (không có). Server không giữ session → dễ scale ngang. Lưu session ra ElastiCache/DynamoDB.', 'Make the web tier stateless by storing sessions in ElastiCache.', 'Làm tầng web phi trạng thái bằng cách lưu session trong ElastiCache.'],
      ['state machine', 'máy trạng thái (Step Functions)', 'Chuỗi các bước (state) có Retry, Catch, Parallel, Wait. Dùng để điều phối nhiều Lambda.', 'Use a Step Functions state machine to coordinate the workflow.', 'Dùng máy trạng thái Step Functions để điều phối luồng công việc.'],
      ['throttling', 'điều tiết (bị giới hạn tốc độ)', 'throttle = van tiết lưu → bóp lại. Lỗi 429 / ThrottlingException → thử lại với exponential backoff.', 'The API returns 429 errors because of throttling.', 'API trả về lỗi 429 do bị điều tiết.'],
      ['pagination', 'phân trang', 'page = trang. API trả kết quả từng trang; dùng LastEvaluatedKey / NextToken để lấy trang kế.', 'Use pagination to read all items from the Scan result.', 'Dùng phân trang để đọc toàn bộ item từ kết quả Scan.'],
      ['batch', 'lô (gom nhiều thao tác)', 'BatchWriteItem / BatchGetItem / SendMessageBatch → giảm số lần gọi API.', 'Send the messages in a batch to reduce API calls.', 'Gửi các message theo lô để giảm số lần gọi API.'],
      ['DynamoDB Streams', 'luồng thay đổi của DynamoDB', 'stream = dòng chảy → ghi lại mọi thay đổi item (giữ 24 giờ), kích hoạt Lambda xử lý.', 'Enable DynamoDB Streams to trigger a function when an item changes.', 'Bật DynamoDB Streams để kích hoạt function khi một item thay đổi.'],
      ['shard', 'phân mảnh (Kinesis)', 'shard = mảnh vỡ. Mỗi shard: ghi 1 MB/s, đọc 2 MB/s. Cần nhiều hơn → tăng số shard.', 'Add more shards to increase the stream throughput.', 'Thêm shard để tăng thông lượng của stream.'],
      ['mapping template', 'mẫu ánh xạ (biến đổi request/response)', 'map = ánh xạ. Viết bằng VTL trong API Gateway để chuyển đổi dữ liệu khi KHÔNG dùng proxy integration.', 'Use a mapping template to transform the request body.', 'Dùng mẫu ánh xạ để biến đổi body của request.'],
      ['proxy integration', 'tích hợp proxy', 'proxy = trung gian → API Gateway chuyển nguyên request cho Lambda; Lambda phải trả đúng định dạng (statusCode, body).', 'With Lambda proxy integration, the function must return a statusCode.', 'Với Lambda proxy integration, function phải trả về statusCode.'],
      ['stage variables', 'biến của stage', 'stage = giai đoạn (dev/test/prod). Giống biến môi trường cho từng stage của API Gateway.', 'Use stage variables to point each stage to a different Lambda alias.', 'Dùng biến stage để trỏ mỗi stage tới một Lambda alias khác nhau.'],
      ['usage plan', 'gói sử dụng (giới hạn theo API key)', 'usage = sự sử dụng. Gắn API key + throttle + quota cho từng khách hàng.', 'Create a usage plan to limit requests for each API key.', 'Tạo gói sử dụng để giới hạn request cho mỗi API key.'],
      ['Lambda destinations', 'đích đến của Lambda (khi thành công / thất bại)', 'destination = đích đến. Với gọi BẤT ĐỒNG BỘ: gửi kết quả tới SQS, SNS, EventBridge hoặc Lambda khác. Chứa nhiều thông tin hơn DLQ.', 'Configure Lambda destinations to send failed events to an SQS queue.', 'Cấu hình Lambda destinations để gửi các sự kiện thất bại tới một hàng đợi SQS.'],
      ['filter policy', 'chính sách lọc message (SNS)', 'filter = lọc. Mỗi subscriber chỉ nhận message có thuộc tính phù hợp → không cần viết code lọc.', 'Add a filter policy so that each queue receives only relevant messages.', 'Thêm chính sách lọc để mỗi hàng đợi chỉ nhận các message liên quan.'],
      ['API caching', 'bộ nhớ đệm của API Gateway', 'Bật cache trên stage của API Gateway (TTL mặc định 300 giây) → giảm số lần gọi backend.', 'Enable API caching on the prod stage to reduce calls to the backend.', 'Bật API caching trên stage prod để giảm số lần gọi backend.'],
      ['Express Workflows', 'luồng Express (Step Functions)', 'express = nhanh. Cho luồng ngắn (tối đa 5 phút), số lượng rất lớn, rẻ. Standard: chạy tới 1 năm, exactly-once.', 'Use Express Workflows for high-volume, short-lived event processing.', 'Dùng Express Workflows cho xử lý sự kiện số lượng lớn, thời gian ngắn.'],
      ['S3 event notifications', 'thông báo sự kiện của S3', 'Khi object được tạo / xóa → S3 gửi sự kiện tới Lambda, SQS, SNS hoặc EventBridge.', 'Use S3 event notifications to invoke a function when a file is uploaded.', 'Dùng thông báo sự kiện S3 để gọi function khi có file được tải lên.'],
      ['delivery stream', 'luồng phân phối (Amazon Data Firehose)', 'deliver = giao hàng. Firehose (tên cũ: Kinesis Data Firehose) tự gom dữ liệu và đẩy vào S3, Redshift, OpenSearch mà không cần viết consumer.', 'Create a delivery stream to load the clickstream data into Amazon S3.', 'Tạo một delivery stream để nạp dữ liệu clickstream vào Amazon S3.']
    ],

    sec: [
      ['least privilege', 'đặc quyền tối thiểu', 'least (ít nhất) + privilege (đặc quyền) → chỉ cấp ĐÚNG quyền cần, không hơn. Đáp án bảo mật gần như luôn đúng.', 'Follow the principle of least privilege when you create IAM policies.', 'Tuân theo nguyên tắc đặc quyền tối thiểu khi tạo IAM policy.'],
      ['IAM role', 'vai trò IAM', 'role = vai diễn → ai "đóng vai" sẽ nhận quyền tạm thời. Không có mật khẩu / khóa dài hạn.', 'Attach an IAM role to the EC2 instance instead of using access keys.', 'Gắn một IAM role vào EC2 instance thay vì dùng access key.'],
      ['assume a role', 'đảm nhận (mượn) một vai trò', 'assume = đảm nhận. Gọi sts:AssumeRole → nhận temporary credentials.', 'The application must assume a role in the production account.', 'Ứng dụng phải đảm nhận một vai trò trong tài khoản production.'],
      ['trust policy', 'chính sách tin cậy', 'trust = tin tưởng → quy định AI (principal) được phép assume role này.', 'Update the trust policy to allow the Lambda service to assume the role.', 'Cập nhật chính sách tin cậy để cho phép dịch vụ Lambda đảm nhận role.'],
      ['identity-based policy', 'chính sách gắn với định danh', 'Gắn vào user / group / role → "người này được làm gì".', 'An identity-based policy is attached to a user, group, or role.', 'Chính sách dựa trên định danh được gắn vào user, group hoặc role.'],
      ['resource-based policy', 'chính sách gắn với tài nguyên', 'Gắn vào tài nguyên (S3 bucket policy, SQS policy, Lambda policy) → "ai được đụng vào tài nguyên này". Có trường Principal.', 'A bucket policy is a resource-based policy.', 'Bucket policy là một chính sách gắn với tài nguyên.'],
      ['explicit deny', 'từ chối tường minh', 'explicit = rõ ràng. Quy tắc vàng: Deny tường minh > Allow > (mặc định) từ chối ngầm.', 'An explicit deny always overrides an allow.', 'Một lệnh từ chối tường minh luôn thắng lệnh cho phép.'],
      ['temporary credentials', 'thông tin xác thực tạm thời', 'temporary = tạm thời. Do STS cấp, có hạn dùng → an toàn hơn access key dài hạn.', 'STS returns temporary credentials that expire after one hour.', 'STS trả về thông tin xác thực tạm thời hết hạn sau một giờ.'],
      ['cross-account access', 'truy cập chéo tài khoản', 'cross = băng qua. Tài khoản A dùng role trong tài khoản B (trust policy + AssumeRole).', 'Configure cross-account access by creating a role in the target account.', 'Cấu hình truy cập chéo tài khoản bằng cách tạo role trong tài khoản đích.'],
      ['principal', 'chủ thể (ai thực hiện request)', 'principal = nhân vật chính → user, role, dịch vụ AWS hoặc tài khoản được nêu trong policy.', 'The principal in the policy is the Lambda service.', 'Chủ thể trong policy là dịch vụ Lambda.'],
      ['instance profile', 'hồ sơ instance (vỏ chứa role cho EC2)', 'profile = hồ sơ. Là "vỏ" chứa IAM role để gắn vào EC2.', 'The instance profile passes the role to the EC2 instance.', 'Instance profile chuyển role cho EC2 instance.'],
      ['envelope encryption', 'mã hóa phong bì', 'envelope = phong bì → dữ liệu mã bằng data key, data key lại được "bỏ phong bì" mã bằng KMS key. Dùng khi dữ liệu > 4 KB.', 'Use envelope encryption to encrypt files larger than 4 KB.', 'Dùng mã hóa phong bì để mã hóa file lớn hơn 4 KB.'],
      ['data key', 'khóa dữ liệu', 'Tạo bằng GenerateDataKey: trả về bản plaintext (dùng xong xóa) và bản đã mã hóa (lưu cùng dữ liệu).', 'Call GenerateDataKey to get a data key from AWS KMS.', 'Gọi GenerateDataKey để lấy khóa dữ liệu từ AWS KMS.'],
      ['customer managed key', 'khóa do khách hàng quản lý', 'customer managed = bạn tự quản: key policy, bật/tắt, xoay vòng, kiểm tra trong CloudTrail.', 'Use a customer managed key to control the key policy.', 'Dùng khóa do khách hàng quản lý để kiểm soát key policy.'],
      ['key rotation', 'xoay vòng khóa', 'rotate = xoay → định kỳ đổi khóa mới. KMS customer managed key: bật tự động (mặc định mỗi năm, chỉnh được 90–2560 ngày) hoặc xoay ngay theo yêu cầu (on-demand).', 'Enable automatic key rotation for the KMS key.', 'Bật xoay vòng khóa tự động cho KMS key.'],
      ['server-side encryption', 'mã hóa phía máy chủ', 'server-side = phía AWS mã hóa giúp (SSE-S3, SSE-KMS, SSE-C).', 'Enable server-side encryption with AWS KMS keys on the bucket.', 'Bật mã hóa phía máy chủ bằng AWS KMS key trên bucket.'],
      ['client-side encryption', 'mã hóa phía máy khách', 'client-side = ứng dụng tự mã hóa TRƯỚC khi gửi lên AWS.', 'Use client-side encryption so that AWS never sees the plaintext data.', 'Dùng mã hóa phía máy khách để AWS không bao giờ thấy dữ liệu gốc.'],
      ['rotate secrets automatically', 'tự động xoay vòng secret', 'Secrets Manager tự đổi mật khẩu DB theo lịch (dùng Lambda). Parameter Store KHÔNG tự xoay vòng.', 'Use AWS Secrets Manager to rotate secrets automatically.', 'Dùng AWS Secrets Manager để tự động xoay vòng secret.'],
      ['SecureString parameter', 'tham số SecureString (Parameter Store)', 'Parameter Store mã hóa giá trị bằng KMS. Rẻ (tier standard miễn phí), hỗ trợ phân cấp /app/prod/db.', 'Store the API key as a SecureString parameter in Parameter Store.', 'Lưu API key dưới dạng tham số SecureString trong Parameter Store.'],
      ['user pool', 'nhóm người dùng (Cognito)', 'Thư mục người dùng: đăng ký, đăng nhập, MFA, trả về JWT token.', 'Use a Cognito user pool to add sign-up and sign-in to the app.', 'Dùng Cognito user pool để thêm đăng ký và đăng nhập cho ứng dụng.'],
      ['identity pool', 'nhóm định danh (Cognito)', 'identity pool = đổi token lấy AWS credentials tạm thời để gọi trực tiếp S3, DynamoDB.', 'Use an identity pool to give users temporary AWS credentials.', 'Dùng identity pool để cấp cho người dùng AWS credentials tạm thời.'],
      ['federated identity', 'định danh liên kết', 'federate = liên kết → đăng nhập bằng Google, Facebook, SAML, OIDC thay vì tạo tài khoản mới.', 'The app supports federated identity with Google accounts.', 'Ứng dụng hỗ trợ định danh liên kết với tài khoản Google.'],
      ['Lambda authorizer', 'trình ủy quyền Lambda', 'authorizer = người cấp quyền → Lambda kiểm tra token/header rồi trả về IAM policy cho API Gateway.', 'Use a Lambda authorizer to validate a custom token.', 'Dùng Lambda authorizer để xác thực một token tùy chỉnh.'],
      ['JSON Web Token', 'token web JSON (JWT)', 'JWT = header.payload.signature. Cognito user pool trả về ID token, access token dạng JWT.', 'API Gateway validates the JSON Web Token from Cognito.', 'API Gateway xác thực JSON Web Token từ Cognito.'],
      ['enable CORS', 'bật CORS (cho phép gọi từ domain khác)', 'Cross-Origin Resource Sharing. Trình duyệt báo "blocked by CORS policy" → bật CORS trên API Gateway / S3.', 'Enable CORS on the API so the web app on another domain can call it.', 'Bật CORS trên API để web app ở domain khác có thể gọi.'],
      ['encryption context', 'ngữ cảnh mã hóa', 'context = ngữ cảnh. Cặp key-value thêm vào khi mã hóa KMS; khi giải mã phải đưa đúng lại.', 'Pass an encryption context when you call the Encrypt API.', 'Truyền ngữ cảnh mã hóa khi gọi API Encrypt.'],
      ['access denied', 'bị từ chối truy cập', 'Lỗi AccessDenied → kiểm tra policy của role, resource policy, KMS key policy, explicit deny.', 'The function fails with an access denied error when it reads the bucket.', 'Function bị lỗi từ chối truy cập khi đọc bucket.'],
      ['sign the request', 'ký request (SigV4)', 'sign = ký tên. SDK tự ký request bằng Signature Version 4 với access key.', 'The SDK uses Signature Version 4 to sign the request.', 'SDK dùng Signature Version 4 để ký request.']
    ],

    deploy: [
      ['blue/green deployment', 'triển khai xanh/lam', '2 môi trường: blue (cũ) và green (mới). Chuyển traffic sang green; lỗi thì quay về blue ngay.', 'A blue/green deployment allows a quick rollback.', 'Triển khai blue/green cho phép quay lui nhanh.'],
      ['canary deployment', 'triển khai canary (thử trên phần nhỏ trước)', 'canary = chim hoàng yến (thợ mỏ dùng để dò khí độc). Vd Canary10Percent5Minutes: 10% trước, 5 phút sau chuyển 100%.', 'A canary deployment shifts 10 percent of traffic first.', 'Triển khai canary chuyển 10% lưu lượng trước.'],
      ['linear deployment', 'triển khai tuyến tính', 'linear = đường thẳng → tăng đều, vd Linear10PercentEvery1Minute.', 'A linear deployment shifts traffic in equal increments.', 'Triển khai tuyến tính chuyển lưu lượng theo các bước bằng nhau.'],
      ['all-at-once', 'tất cả cùng lúc', 'Nhanh nhất nhưng rủi ro cao nhất; với Elastic Beanstalk sẽ có downtime. Đứng trước danh từ nên có gạch nối: an all-at-once deployment.', 'An all-at-once deployment is the fastest but causes downtime.', 'Triển khai tất cả cùng lúc là nhanh nhất nhưng gây gián đoạn.'],
      ['rolling deployment', 'triển khai cuốn chiếu (từng đợt)', 'roll = lăn → cập nhật từng batch instance. Trong lúc deploy, sức chứa bị giảm.', 'A rolling deployment updates instances in batches.', 'Triển khai cuốn chiếu cập nhật instance theo từng đợt.'],
      ['rolling with additional batch', 'cuốn chiếu kèm đợt bổ sung', 'additional = thêm → tạo thêm batch mới trước để GIỮ NGUYÊN sức chứa trong lúc deploy (Elastic Beanstalk).', 'Use rolling with additional batch to maintain full capacity.', 'Dùng rolling with additional batch để giữ nguyên sức chứa.'],
      ['immutable deployment', 'triển khai bất biến', 'immutable = không thay đổi → không sửa instance cũ, tạo instance MỚI hoàn toàn trong ASG tạm. An toàn, rollback nhanh.', 'An immutable deployment launches new instances in a new Auto Scaling group.', 'Triển khai bất biến tạo instance mới trong một Auto Scaling group mới.'],
      ['traffic shifting', 'chuyển dịch lưu lượng', 'shift = dịch chuyển → chuyển dần % request sang phiên bản mới (alias weights, CodeDeploy).', 'Use weighted aliases for traffic shifting between versions.', 'Dùng alias có trọng số để chuyển dịch lưu lượng giữa các phiên bản.'],
      ['roll back', 'quay lui (về bản trước)', 'roll back = cuộn lại. CodeDeploy có thể tự quay lui khi CloudWatch alarm kích hoạt.', 'Configure CodeDeploy to roll back automatically when an alarm fires.', 'Cấu hình CodeDeploy tự động quay lui khi alarm kích hoạt.'],
      ['function alias', 'bí danh của function (Lambda alias)', 'alias = biệt danh → con trỏ (vd "prod") trỏ tới 1 version; có thể chia trọng số giữa 2 version.', 'Point the prod function alias to version 5.', 'Trỏ bí danh prod của function tới version 5.'],
      ['published version', 'phiên bản đã phát hành (bất biến)', 'Version đã publish KHÔNG sửa được; $LATEST thì sửa được.', 'A published version of a Lambda function cannot be changed.', 'Phiên bản đã phát hành của Lambda function không thể thay đổi.'],
      ['AppSpec file', 'tệp AppSpec (CodeDeploy)', 'appspec.yml: chỉ CodeDeploy copy file gì, chạy script nào ở mỗi lifecycle hook.', 'The AppSpec file defines the lifecycle event hooks.', 'Tệp AppSpec định nghĩa các hook của sự kiện vòng đời.'],
      ['buildspec file', 'tệp buildspec (CodeBuild)', 'buildspec.yml ở thư mục gốc: các phase install, pre_build, build, post_build và artifacts.', 'Add the test commands to the buildspec file.', 'Thêm các lệnh test vào tệp buildspec.'],
      ['lifecycle event hooks', 'hook sự kiện vòng đời', 'hook = cái móc → chạy script tại các mốc: BeforeInstall, AfterInstall, ApplicationStart, ValidateService.', 'Run the database migration in the lifecycle event hooks.', 'Chạy migration database trong các hook sự kiện vòng đời.'],
      ['build artifact', 'sản phẩm build', 'artifact = sản phẩm → file đầu ra (zip, jar, image) lưu vào S3 để stage sau dùng.', 'CodeBuild uploads the build artifact to Amazon S3.', 'CodeBuild tải sản phẩm build lên Amazon S3.'],
      ['manual approval', 'phê duyệt thủ công', 'manual = bằng tay. Action trong CodePipeline dừng chờ người duyệt trước khi deploy production.', 'Add a manual approval action before the production stage.', 'Thêm một action phê duyệt thủ công trước stage production.'],
      ['infrastructure as code', 'hạ tầng dưới dạng code (IaC)', 'Định nghĩa tài nguyên bằng file template (CloudFormation, SAM, CDK) → lặp lại được, review được.', 'The team uses infrastructure as code to create identical environments.', 'Nhóm dùng hạ tầng dưới dạng code để tạo các môi trường giống hệt nhau.'],
      ['change set', 'tập thay đổi (xem trước khi cập nhật stack)', 'change set = bộ thay đổi → XEM TRƯỚC CloudFormation sẽ thêm/sửa/xóa gì rồi mới thực thi.', 'Create a change set to preview the changes before updating the stack.', 'Tạo change set để xem trước thay đổi trước khi cập nhật stack.'],
      ['drift detection', 'phát hiện lệch cấu hình', 'drift = trôi dạt → ai đó sửa tài nguyên bằng tay, khác với template.', 'Run drift detection to find resources that were changed manually.', 'Chạy phát hiện lệch cấu hình để tìm tài nguyên bị sửa thủ công.'],
      ['nested stack', 'stack lồng nhau', 'nest = tổ chim → stack nằm trong stack, tái sử dụng thành phần chung.', 'Use a nested stack to reuse the common network configuration.', 'Dùng stack lồng nhau để tái sử dụng cấu hình mạng chung.'],
      ['intrinsic function', 'hàm nội tại (CloudFormation)', 'intrinsic = vốn có. Ví dụ: !Ref, !GetAtt, !Sub, !Join, !ImportValue.', 'Use the GetAtt intrinsic function to get the ARN of the queue.', 'Dùng hàm nội tại GetAtt để lấy ARN của hàng đợi.'],
      ['export the output', 'xuất giá trị output', 'Outputs + Export ở stack A, rồi Fn::ImportValue ở stack B → tham chiếu chéo stack.', 'Export the output so that another stack can import the value.', 'Xuất giá trị output để stack khác có thể import.'],
      ['SAM template', 'template SAM (Serverless Application Model)', 'Có dòng Transform: AWS::Serverless-2016-10-31. Lệnh: sam build, sam deploy, sam local invoke.', 'Define the function and the API in a SAM template.', 'Định nghĩa function và API trong một SAM template.'],
      ['deployment configuration', 'cấu hình triển khai', 'Quy định tốc độ deploy: AllAtOnce, HalfAtATime, Canary, Linear (CodeDeploy).', 'Choose a deployment configuration that shifts traffic gradually.', 'Chọn một cấu hình triển khai chuyển lưu lượng dần dần.'],
      ['staging environment', 'môi trường staging (thử trước production)', 'stage = sân khấu tập → giống production để test lần cuối.', 'Test the release in a staging environment first.', 'Kiểm thử bản phát hành trong môi trường staging trước.'],
      ['container image', 'ảnh container', 'image = ảnh → gói ứng dụng + thư viện. Lưu trong Amazon ECR, chạy bằng ECS / Fargate / Lambda.', 'Push the container image to Amazon ECR.', 'Đẩy ảnh container lên Amazon ECR.'],
      ['task definition', 'định nghĩa task (ECS)', 'Bản thiết kế cho container: image, CPU, memory, port, task role.', 'Specify the task role in the ECS task definition.', 'Chỉ định task role trong định nghĩa task ECS.'],
      ['.ebextensions folder', 'thư mục cấu hình Elastic Beanstalk', 'File .config trong thư mục .ebextensions để cài package, đặt biến, tạo tài nguyên cho Beanstalk.', 'Add a config file to the .ebextensions folder to install packages.', 'Thêm file config vào thư mục .ebextensions để cài các package.']
    ],

    ops: [
      ['root cause', 'nguyên nhân gốc rễ', 'root = rễ cây. Root cause analysis = phân tích tìm nguyên nhân gốc.', 'Use AWS X-Ray to find the root cause of the latency.', 'Dùng AWS X-Ray để tìm nguyên nhân gốc rễ của độ trễ.'],
      ['bottleneck', 'nút thắt cổ chai', 'bottle (chai) + neck (cổ) → chỗ hẹp làm chậm cả hệ thống.', 'The service map shows that the database is the bottleneck.', 'Service map cho thấy database là nút thắt cổ chai.'],
      ['latency', 'độ trễ', 'Thời gian từ lúc gửi request tới khi nhận phản hồi. Low latency = nhanh.', 'The application needs single-digit millisecond latency.', 'Ứng dụng cần độ trễ dưới 10 mili giây.'],
      ['throughput', 'thông lượng', 'through (xuyên qua) + put → lượng dữ liệu / request xử lý được mỗi giây.', 'Increase the throughput of the stream by adding shards.', 'Tăng thông lượng của stream bằng cách thêm shard.'],
      ['custom metric', 'chỉ số tùy chỉnh', 'custom = tùy chỉnh. Gửi bằng PutMetricData (vd: số đơn hàng/phút, memory EC2).', 'Publish a custom metric with the PutMetricData API.', 'Gửi một chỉ số tùy chỉnh bằng API PutMetricData.'],
      ['metric filter', 'bộ lọc chỉ số (từ log)', 'Tìm mẫu chữ trong CloudWatch Logs (vd "ERROR") và đếm thành metric → đặt alarm.', 'Create a metric filter that counts ERROR messages in the logs.', 'Tạo bộ lọc chỉ số đếm các thông báo ERROR trong log.'],
      ['alarm threshold', 'ngưỡng cảnh báo', 'threshold = ngưỡng cửa → vượt ngưỡng thì alarm chuyển sang ALARM và gửi SNS.', 'Set the alarm threshold to 5 errors in 1 minute.', 'Đặt ngưỡng cảnh báo là 5 lỗi trong 1 phút.'],
      ['log group', 'nhóm log', 'Lambda tự ghi log vào log group /aws/lambda/tên-function. Đặt retention để tiết kiệm.', 'Set a retention period on the log group.', 'Đặt thời gian lưu giữ cho nhóm log.'],
      ['distributed tracing', 'truy vết phân tán', 'distributed = phân tán → theo dõi 1 request đi qua nhiều service (X-Ray).', 'Use AWS X-Ray for distributed tracing across microservices.', 'Dùng AWS X-Ray để truy vết phân tán giữa các microservice.'],
      ['active tracing', 'theo dõi chủ động (bật X-Ray cho Lambda)', 'Bật Active tracing trên Lambda / API Gateway để gửi trace tới X-Ray. Role cần quyền xray:PutTraceSegments.', 'Enable active tracing on the Lambda function.', 'Bật active tracing trên Lambda function.'],
      ['service map', 'bản đồ dịch vụ', 'Hình X-Ray vẽ các service cùng độ trễ / lỗi giữa chúng.', 'The X-Ray service map highlights the failing component.', 'Bản đồ dịch vụ X-Ray làm nổi bật thành phần bị lỗi.'],
      ['subsegment', 'phân đoạn con', 'segment = đoạn. Subsegment ghi chi tiết lời gọi con (DynamoDB, HTTP) bên trong một segment.', 'Add a subsegment to measure the time of the external API call.', 'Thêm một phân đoạn con để đo thời gian gọi API bên ngoài.'],
      ['annotations', 'chú thích (được đánh index, lọc được)', 'annotations = key-value ĐƯỢC INDEX → dùng filter expression để tìm trace. Metadata thì KHÔNG index.', 'Add annotations so that you can filter traces by user ID.', 'Thêm annotation để có thể lọc trace theo user ID.'],
      ['metadata', 'siêu dữ liệu (không index)', 'meta = về chính nó → dữ liệu thêm để xem, KHÔNG dùng để tìm kiếm trace.', 'Store the full response in metadata because it does not need to be searchable.', 'Lưu toàn bộ phản hồi trong metadata vì không cần tìm kiếm.'],
      ['sampling rule', 'quy tắc lấy mẫu', 'sample = mẫu → chỉ ghi một phần request để giảm chi phí X-Ray.', 'Change the sampling rule to record more requests.', 'Thay đổi quy tắc lấy mẫu để ghi nhận nhiều request hơn.'],
      ['structured logging', 'ghi log có cấu trúc (JSON)', 'structured = có cấu trúc → log dạng JSON, dễ truy vấn bằng CloudWatch Logs Insights.', 'Use structured logging in JSON format.', 'Dùng ghi log có cấu trúc ở định dạng JSON.'],
      ['embedded metric format', 'định dạng chỉ số nhúng (EMF)', 'embed = nhúng → ghi metric NGAY TRONG log JSON, CloudWatch tự tách thành metric, không cần gọi PutMetricData.', 'Use the embedded metric format to create metrics from Lambda logs.', 'Dùng định dạng chỉ số nhúng để tạo metric từ log Lambda.'],
      ['Logs Insights', 'truy vấn log (CloudWatch Logs Insights)', 'insight = cái nhìn sâu → viết câu query để tìm / thống kê log nhanh.', 'Use CloudWatch Logs Insights to query the logs for errors.', 'Dùng CloudWatch Logs Insights để truy vấn log tìm lỗi.'],
      ['timeout', 'hết thời gian chờ', 'time + out → chạy quá thời gian cho phép. Lambda tối đa 15 phút; API Gateway: timeout tích hợp mặc định 29 giây (REST API regional/private có thể xin tăng).', 'Increase the function timeout to 30 seconds.', 'Tăng thời gian chờ tối đa của function lên 30 giây.'],
      ['memory allocation', 'lượng bộ nhớ cấp phát', 'Lambda: tăng memory = tăng CPU tương ứng → code chạy nhanh hơn.', 'Increase the memory allocation to give the function more CPU.', 'Tăng lượng bộ nhớ cấp phát để function có thêm CPU.'],
      ['ProvisionedThroughputExceededException', 'lỗi vượt thông lượng cấp phát', 'Request vượt RCU/WCU → thử lại với exponential backoff, tăng capacity hoặc chuyển on-demand.', 'The application receives a ProvisionedThroughputExceededException error.', 'Ứng dụng nhận lỗi ProvisionedThroughputExceededException.'],
      ['Query instead of Scan', 'dùng Query thay vì Scan', 'Scan đọc CẢ BẢNG (chậm, tốn). Query chỉ đọc theo partition key → nhanh, rẻ.', 'Use Query instead of Scan to reduce consumed capacity.', 'Dùng Query thay vì Scan để giảm dung lượng tiêu thụ.'],
      ['projection expression', 'biểu thức chiếu (chỉ lấy vài thuộc tính)', 'project = chiếu ra → chỉ trả về các thuộc tính cần (giảm dữ liệu truyền về, KHÔNG giảm RCU).', 'Use a projection expression to return only the name attribute.', 'Dùng biểu thức chiếu để chỉ trả về thuộc tính name.'],
      ['parallel scan', 'quét song song', 'parallel = song song → chia bảng thành nhiều segment quét cùng lúc → nhanh hơn với bảng lớn.', 'Use a parallel scan to read a large table faster.', 'Dùng quét song song để đọc bảng lớn nhanh hơn.'],
      ['read replica', 'bản sao chỉ đọc', 'replica = bản sao → giảm tải đọc cho database chính (RDS / Aurora).', 'Add a read replica to offload read traffic.', 'Thêm bản sao chỉ đọc để giảm tải lưu lượng đọc.'],
      ['connection pooling', 'gom nhóm kết nối (RDS Proxy)', 'pool = hồ chứa → dùng chung kết nối DB. Lambda mở quá nhiều kết nối tới RDS → dùng RDS Proxy.', 'Use RDS Proxy for connection pooling from Lambda functions.', 'Dùng RDS Proxy để gom nhóm kết nối từ các Lambda function.'],
      ['outside the handler', 'bên ngoài hàm handler', 'Khởi tạo SDK client, kết nối DB NGOÀI handler để tái sử dụng giữa các lần gọi (execution context reuse).', 'Initialize the database connection outside the handler.', 'Khởi tạo kết nối database bên ngoài hàm handler.'],
      ['high-resolution metric', 'chỉ số độ phân giải cao', 'resolution = độ phân giải → metric theo từng 1 giây (bình thường là 60 giây).', 'Publish a high-resolution metric to see per-second data.', 'Gửi chỉ số độ phân giải cao để xem dữ liệu từng giây.'],
      ['detailed monitoring', 'giám sát chi tiết (EC2 mỗi 1 phút)', 'Mặc định EC2 gửi metric 5 phút/lần; detailed monitoring → 1 phút/lần.', 'Enable detailed monitoring to get metrics every minute.', 'Bật giám sát chi tiết để nhận metric mỗi phút.'],
      ['caching layer', 'tầng bộ nhớ đệm', 'layer = tầng. Thêm ElastiCache / DAX / CloudFront phía trước để giảm độ trễ và tải DB.', 'Add a caching layer in front of the database.', 'Thêm một tầng bộ nhớ đệm phía trước database.'],
      ['DynamoDB Accelerator', 'bộ tăng tốc DynamoDB (DAX)', 'Cache trong bộ nhớ dành riêng cho DynamoDB, độ trễ micro giây, gần như không phải sửa code.', 'Use DynamoDB Accelerator to get microsecond read latency.', 'Dùng DynamoDB Accelerator để có độ trễ đọc ở mức micro giây.'],
      ['burst limit', 'giới hạn đột biến', 'burst = bùng nổ. API Gateway giới hạn theo rate (request/giây) và burst (số request dồn cùng lúc). Vượt → lỗi 429.', 'Increase the rate and burst limit in the usage plan.', 'Tăng giới hạn tốc độ và giới hạn đột biến trong usage plan.'],
      ['X-Ray daemon', 'tiến trình nền X-Ray', 'daemon = tiến trình chạy ngầm. Trên EC2 / ECS phải chạy daemon (UDP 2000) để gửi trace; Lambda đã có sẵn.', 'Run the X-Ray daemon as a sidecar container in the ECS task.', 'Chạy X-Ray daemon dưới dạng container sidecar trong ECS task.']
    ]
  },

  // Phát âm các từ khó (IPA + cách đọc gần đúng cho người Việt). Viết HOA = âm nhấn.
  pronounce: {
    idempotent: ['/ˌaɪ.dəmˈpoʊ.tənt/', 'ai-đầm-PÂU-tần'],
    cache: ['/kæʃ/', 'đọc giống "cash", KHÔNG đọc "ca-chê"'],
    queue: ['/kjuː/', 'đọc "kiu", phần "ueue" câm'],
    throughput: ['/ˈθruː.pʊt/', 'THRU-pút'],
    cardinality: ['/ˌkɑːr.dəˈnæl.ə.ti/', 'ca-đờ-NE-lờ-ti'],
    asynchronous: ['/eɪˈsɪŋ.krə.nəs/', 'ây-SING-crờ-nợs'],
    synchronous: ['/ˈsɪŋ.krə.nəs/', 'SING-crờ-nợs'],
    latency: ['/ˈleɪ.tən.si/', 'LÂY-tần-si'],
    throttling: ['/ˈθrɑː.təl.ɪŋ/', 'THRA-tờ-linh'],
    immutable: ['/ɪˈmjuː.tə.bəl/', 'i-MIU-tờ-bồ'],
    intermittently: ['/ˌɪn.tərˈmɪt.ənt.li/', 'in-tơ-MÍT-tần-li'],
    premises: ['/ˈprem.ɪ.sɪz/', 'PREM-mi-xịt (luôn có "s": on-premises)'],
    privilege: ['/ˈprɪv.əl.ɪdʒ/', 'PRIV-vờ-lịch'],
    principal: ['/ˈprɪn.sə.pəl/', 'PRIN-xờ-pồ'],
    envelope: ['/ˈen.və.loʊp/', 'EN-vờ-lốp'],
    canary: ['/kəˈner.i/', 'cờ-NE-ri'],
    granular: ['/ˈɡræn.jə.lər/', 'GREN-niu-lờ'],
    retrieve: ['/rɪˈtriːv/', 'ri-TRÍV'],
    decouple: ['/diːˈkʌp.əl/', 'đi-CẤP-pồ'],
    bottleneck: ['/ˈbɑː.təl.nek/', 'BA-tồ-néc'],
    metadata: ['/ˈmet.əˌdeɪ.tə/', 'MÉT-tờ-đây-tờ'],
    annotations: ['/ˌæn.əˈteɪ.ʃənz/', 'en-nờ-TÂY-shần'],
    pagination: ['/ˌpædʒ.ɪˈneɪ.ʃən/', 'pe-chi-NÂY-shần'],
    intrinsic: ['/ɪnˈtrɪn.zɪk/', 'in-TRIN-dịc'],
    artifact: ['/ˈɑːr.tə.fækt/', 'A-tờ-phéc'],
    authorizer: ['/ˈɔː.θə.raɪ.zər/', 'O-thờ-rai-dờ'],
    troubleshoot: ['/ˈtrʌb.əl.ʃuːt/', 'TRẤP-bồ-shút'],
    deduplication: ['/diːˌduː.plɪˈkeɪ.ʃən/', 'đi-đu-pli-KÂY-shần'],
    provisioned: ['/prəˈvɪʒ.ənd/', 'prờ-VI-giần'],
    ensure: ['/ɪnˈʃʊr/', 'in-SHUA'],
    comply: ['/kəmˈplaɪ/', 'cầm-PLAI'],
    jitter: ['/ˈdʒɪt.ər/', 'CHÍT-tờ'],
    optimistic: ['/ˌɑːp.təˈmɪs.tɪk/', 'áp-tờ-MÍT-tíc'],
    lambda: ['/ˈlæm.də/', 'LEM-đờ (chữ b câm)'],
    fifo: ['/ˈfaɪ.foʊ/', 'PHAI-phâu'],
    cognito: ['/ˈkɑːɡ.nɪ.toʊ/', 'CAG-ni-tâu'],
    daemon: ['/ˈdiː.mən/', 'ĐI-mần'],
    transient: ['/ˈtræn.zi.ənt/', 'TREN-di-ần'],
    stale: ['/steɪl/', 'STÂY-ồ'],
    schedule: ['/ˈskedʒ.uːl/', 'SKE-chuu (Anh-Mỹ)'],
    ephemeral: ['/ɪˈfem.ər.əl/', 'i-PHEM-mờ-rồ']
  },

  formulas: [
    {
      kind: 'Câu hỏi (đề bài)',
      pattern: 'Which solution will meet these requirements with the LEAST [operational overhead]?',
      vi: 'Giải pháp nào sẽ đáp ứng các yêu cầu này với [công sức vận hành] ÍT NHẤT?',
      note: 'Câu kết của đa số đề. Thay [..] bằng: operational overhead / development effort / latency. Từ viết HOA chính là tiêu chí chấm điểm!',
      examples: [
        ['Which solution will meet these requirements with the LEAST operational overhead?', 'Giải pháp nào đáp ứng các yêu cầu này với ít công sức vận hành nhất?'],
        ['Which solution will meet these requirements with the LEAST development effort?', 'Giải pháp nào đáp ứng các yêu cầu này với ít công sức phát triển nhất?'],
        ['Which solution will meet these requirements with the fewest code changes?', 'Giải pháp nào đáp ứng các yêu cầu này với ít thay đổi code nhất?']
      ]
    },
    {
      kind: 'Câu hỏi (đề bài)',
      pattern: 'Which solution will meet these requirements MOST [cost-effectively]?',
      vi: 'Giải pháp nào đáp ứng các yêu cầu này một cách [tiết kiệm chi phí] NHẤT?',
      note: 'MOST + trạng từ (-ly): cost-effectively, securely, efficiently.',
      examples: [
        ['Which solution will meet these requirements MOST cost-effectively?', 'Giải pháp nào đáp ứng các yêu cầu này tiết kiệm chi phí nhất?'],
        ['Which solution will meet these requirements MOST securely?', 'Giải pháp nào đáp ứng các yêu cầu này an toàn nhất?']
      ]
    },
    {
      kind: 'Câu hỏi (đề bài)',
      pattern: 'A developer needs to [verb] [object] so that [result].',
      vi: 'Một developer cần [làm gì] [với cái gì] để [đạt kết quả gì].',
      note: 'Câu mở đầu đề. "so that" = để mà → phần sau là MỤC TIÊU, đọc kỹ phần này.',
      examples: [
        ['A developer needs to store user sessions so that any instance can read them.', 'Một developer cần lưu session người dùng để bất kỳ instance nào cũng đọc được.'],
        ['A developer needs to process payments in sequence so that no customer is charged twice.', 'Một developer cần xử lý thanh toán theo thứ tự để không khách hàng nào bị trừ tiền hai lần.']
      ]
    },
    {
      kind: 'Câu hỏi (đề bài)',
      pattern: 'The application must [verb] without [verb-ing] [object].',
      vi: 'Ứng dụng phải [làm gì] mà không [làm điều gì].',
      note: 'without + V-ing = mà không... Phần sau "without" là điều CẤM → loại đáp án vi phạm.',
      examples: [
        ['The application must access Amazon S3 without storing access keys.', 'Ứng dụng phải truy cập Amazon S3 mà không lưu access key.'],
        ['The function must read the secret without exposing it in the code.', 'Function phải đọc secret mà không để lộ nó trong code.']
      ]
    },
    {
      kind: 'Câu hỏi (đề bài)',
      pattern: 'What is the MOST likely cause of [the issue]?',
      vi: 'Nguyên nhân có khả năng NHẤT của [sự cố] là gì?',
      note: 'Dạng troubleshooting. Tìm triệu chứng trong đề (lỗi 429? AccessDenied? timeout?) để khoanh vùng.',
      examples: [
        ['What is the MOST likely cause of the throttling errors?', 'Nguyên nhân có khả năng nhất của lỗi bị điều tiết là gì?'],
        ['What is the MOST likely cause of the increased latency?', 'Nguyên nhân có khả năng nhất của việc độ trễ tăng là gì?']
      ]
    },
    {
      kind: 'Câu hỏi (đề bài)',
      pattern: 'Which combination of steps should the developer take to [goal]? (Choose [TWO].)',
      vi: 'Developer nên thực hiện kết hợp những bước nào để [mục tiêu]? (Chọn [HAI].)',
      note: 'Hai đáp án đúng thường BỔ SUNG cho nhau (vd: tạo role + gắn role), không trùng ý.',
      examples: [
        ['Which combination of steps should the developer take to fix the issue? (Choose TWO.)', 'Developer nên thực hiện những bước nào để sửa sự cố? (Chọn HAI.)'],
        ['Which combination of steps should the developer take to secure the API? (Choose THREE.)', 'Developer nên thực hiện những bước nào để bảo mật API? (Chọn BA.)']
      ]
    },
    {
      kind: 'Đáp án (lựa chọn)',
      pattern: 'Configure [service] to [action] when [event].',
      vi: 'Cấu hình [dịch vụ] để [hành động] khi [sự kiện xảy ra].',
      note: 'Mẫu đáp án hướng sự kiện (event-driven): S3 event, EventBridge rule, DynamoDB Streams.',
      examples: [
        ['Configure Amazon S3 to invoke the Lambda function when an object is uploaded.', 'Cấu hình Amazon S3 gọi Lambda function khi một object được tải lên.'],
        ['Configure an EventBridge rule to start the workflow when the order status changes.', 'Cấu hình một EventBridge rule để bắt đầu luồng xử lý khi trạng thái đơn hàng thay đổi.']
      ]
    },
    {
      kind: 'Đáp án (lựa chọn)',
      pattern: 'Use [service] to [action].',
      vi: 'Dùng [dịch vụ] để [làm gì].',
      note: 'Mẫu đáp án phổ biến nhất. Ghép đúng cặp dịch vụ ↔ việc là ăn điểm.',
      examples: [
        ['Use AWS Secrets Manager to rotate the database credentials.', 'Dùng AWS Secrets Manager để xoay vòng thông tin đăng nhập database.'],
        ['Use Amazon SQS to decouple the producer from the consumer.', 'Dùng Amazon SQS để tách rời producer khỏi consumer.']
      ]
    },
    {
      kind: 'Đáp án (lựa chọn)',
      pattern: 'Store [data] in [service] and retrieve it at runtime.',
      vi: 'Lưu [dữ liệu] trong [dịch vụ] và lấy ra lúc chạy.',
      note: 'Đáp án kinh điển thay cho hard-coded credentials / config.',
      examples: [
        ['Store the database password in Secrets Manager and retrieve it at runtime.', 'Lưu mật khẩu database trong Secrets Manager và lấy ra lúc chạy.'],
        ['Store the configuration in Parameter Store and retrieve it at runtime.', 'Lưu cấu hình trong Parameter Store và lấy ra lúc chạy.']
      ]
    },
    {
      kind: 'Đáp án (lựa chọn)',
      pattern: 'Enable [feature] on [resource].',
      vi: 'Bật [tính năng] trên [tài nguyên].',
      note: 'Thường là đáp án "minimal code changes": chỉ cần bật tính năng có sẵn.',
      examples: [
        ['Enable active tracing on the Lambda function.', 'Bật active tracing trên Lambda function.'],
        ['Enable long polling on the SQS queue.', 'Bật long polling trên hàng đợi SQS.'],
        ['Enable versioning on the S3 bucket.', 'Bật versioning trên S3 bucket.']
      ]
    },
    {
      kind: 'Đáp án (lựa chọn)',
      pattern: 'Create an IAM role with [permissions] and attach it to [resource].',
      vi: 'Tạo một IAM role có [quyền] và gắn nó vào [tài nguyên].',
      note: 'Cách chuẩn để cấp quyền cho EC2 / Lambda / ECS: luôn là ROLE, không phải access key.',
      examples: [
        ['Create an IAM role with read access and attach it to the EC2 instance.', 'Tạo một IAM role có quyền đọc và gắn nó vào EC2 instance.'],
        ['Create an IAM role with the required permissions and attach it to the ECS task.', 'Tạo một IAM role có các quyền cần thiết và gắn nó vào ECS task.']
      ]
    },
    {
      kind: 'Đáp án (lựa chọn)',
      pattern: '[Increase] the [setting] of the [resource].',
      vi: '[Tăng] [thông số] của [tài nguyên].',
      note: 'Increase = tăng, Decrease/Reduce = giảm. Hay gặp: visibility timeout, memory, timeout, batch size.',
      examples: [
        ['Increase the visibility timeout of the SQS queue.', 'Tăng thời gian ẩn message của hàng đợi SQS.'],
        ['Increase the memory of the Lambda function.', 'Tăng bộ nhớ của Lambda function.'],
        ['Reduce the batch size of the event source mapping.', 'Giảm kích thước lô của event source mapping.']
      ]
    },
    {
      kind: 'Đáp án (lựa chọn)',
      pattern: 'Replace [A] with [B].',
      vi: 'Thay [A] bằng [B].',
      note: 'Chú ý thứ tự: replace CÁI CŨ with CÁI MỚI.',
      examples: [
        ['Replace the Scan operation with a Query operation.', 'Thay thao tác Scan bằng thao tác Query.'],
        ['Replace the hard-coded credentials with an IAM role.', 'Thay thông tin đăng nhập ghi cứng bằng một IAM role.']
      ]
    },
    {
      kind: 'Đáp án (lựa chọn)',
      pattern: 'Implement [technique] in the application code.',
      vi: 'Triển khai [kỹ thuật] trong code ứng dụng.',
      note: 'Dùng khi cần sửa logic: retry, backoff, idempotency, pagination.',
      examples: [
        ['Implement exponential backoff in the application code.', 'Triển khai cơ chế chờ tăng theo cấp số nhân trong code ứng dụng.'],
        ['Implement retries with jitter in the application code.', 'Triển khai thử lại có độ trễ ngẫu nhiên trong code ứng dụng.']
      ]
    },
    {
      kind: 'Giải thích nguyên nhân',
      pattern: 'The [problem] happens because [reason].',
      vi: '[Vấn đề] xảy ra vì [lý do].',
      note: 'because + mệnh đề (S + V). Dùng để đọc hiểu đáp án dạng giải thích nguyên nhân.',
      examples: [
        ['The error happens because the execution role does not have permission.', 'Lỗi xảy ra vì vai trò thực thi không có quyền.'],
        ['The duplicate processing happens because the visibility timeout is too short.', 'Việc xử lý trùng xảy ra vì thời gian ẩn message quá ngắn.']
      ]
    }
  ],

  signals: [
    ['LEAST operational overhead', 'Dịch vụ managed / serverless (Lambda, DynamoDB, Fargate…)', 'Loại đáp án phải tự cài EC2, tự viết cron script, tự vá lỗi.'],
    ['MOST cost-effective', 'Trả theo mức dùng: on-demand, serverless, S3 lifecycle, tắt tài nguyên rảnh', 'Loại tài nguyên chạy 24/7 hoặc cấp phát dư.'],
    ['minimal code changes', 'Bật cấu hình / tính năng có sẵn (DAX, API caching, X-Ray…)', 'Loại đáp án viết lại logic hoặc đổi database.'],
    ['decouple components', 'Amazon SQS / SNS / EventBridge', 'Hàng đợi / sự kiện làm "đệm" giữa producer và consumer.'],
    ['in order, no duplicates', 'SQS FIFO queue (+ message group ID)', 'Standard queue không đảm bảo thứ tự và có thể trùng.'],
    ['send one message to many subscribers', 'SNS fan-out → nhiều SQS queue', 'Pub/sub: publish 1 lần, nhiều nơi nhận.'],
    ['real-time streaming data, replay', 'Kinesis Data Streams', 'Giữ dữ liệu để đọc lại, nhiều consumer, thứ tự theo shard.'],
    ['hard-coded credentials', 'IAM role (EC2 instance profile / Lambda execution role / ECS task role)', 'Role cấp temporary credentials tự xoay vòng.'],
    ['rotate database passwords automatically', 'AWS Secrets Manager', 'Parameter Store không tự xoay vòng.'],
    ['store configuration, low cost, hierarchy', 'SSM Parameter Store', 'Standard tier miễn phí, hỗ trợ đường dẫn /app/prod/…'],
    ['temporary access to a private S3 object', 'S3 presigned URL', 'Có thời hạn, người dùng không cần tài khoản AWS.'],
    ['sign-up and sign-in for app users', 'Cognito user pool', 'Quản lý người dùng, trả về JWT.'],
    ['users need AWS credentials to access S3 directly', 'Cognito identity pool', 'Đổi token → temporary AWS credentials.'],
    ['microsecond latency for DynamoDB reads', 'DynamoDB Accelerator (DAX)', 'DAX chuyên cho DynamoDB, gần như không sửa code; ElastiCache là cache chung.'],
    ['share session data across instances', 'ElastiCache (Redis) hoặc DynamoDB', 'Giữ tầng web stateless.'],
    ['reduce Lambda cold starts', 'Provisioned concurrency', 'Giữ sẵn môi trường đã khởi tạo.'],
    ['shift traffic gradually with automatic rollback', 'CodeDeploy canary/linear + CloudWatch alarms', 'Alarm kích hoạt → tự động quay lui.'],
    ['trace requests across services', 'AWS X-Ray', 'Service map, segments, tìm bottleneck.'],
    ['filter traces by a custom field', 'X-Ray annotations', 'Annotation được index; metadata thì không.'],
    ['encrypt data larger than 4 KB with KMS', 'Envelope encryption (GenerateDataKey)', 'API KMS Encrypt chỉ nhận tối đa 4 KB.'],
    ['ProvisionedThroughputExceededException', 'Exponential backoff + jitter, tăng capacity hoặc on-demand', 'Kiểm tra thêm hot partition.'],
    ['messages are processed more than once', 'Tăng visibility timeout + xử lý idempotent', 'Timeout ngắn hơn thời gian xử lý → message hiện lại.'],
    ['messages fail repeatedly', 'Dead-letter queue (maxReceiveCount)', 'Tách message lỗi ra để phân tích.'],
    ['too many empty receives from SQS', 'Long polling (WaitTimeSeconds = 20)', 'Giảm số lần gọi và chi phí.'],
    ['coordinate multiple steps with retries', 'AWS Step Functions', 'State machine có Retry / Catch, chờ, chạy song song.'],
    ['preview changes before updating a stack', 'CloudFormation change set', 'Xem trước sẽ thêm / sửa / xóa gì.'],
    ['reuse a value from another stack', 'Outputs + Export và Fn::ImportValue', 'Tham chiếu chéo giữa các stack.'],
    ['blocked by CORS policy', 'Bật CORS trên API Gateway / S3', 'Trả về header Access-Control-Allow-Origin.'],
    ['run code on a schedule', 'EventBridge scheduled rule (cron / rate) → Lambda', 'Không cần server chạy cron.'],
    ['upload very large files to S3', 'Multipart upload', 'Nên dùng khi > 100 MB, bắt buộc khi > 5 GB.'],
    ['delete expired items automatically', 'DynamoDB TTL', 'Xóa miễn phí, không tốn WCU.'],
    ['prevent lost updates from concurrent writes', 'Optimistic locking / conditional write', 'Dùng version number + ConditionExpression.'],
    ['too many database connections from Lambda', 'RDS Proxy', 'Gom nhóm và tái sử dụng kết nối.'],
    ['test Lambda functions locally', 'AWS SAM CLI (sam local invoke)', 'Chạy function trên máy bằng Docker.'],
    ['route failed asynchronous invocations', 'Lambda destinations (on-failure) hoặc DLQ', 'Destinations chứa nhiều thông tin hơn (cả payload lẫn lỗi).'],
    ['subscribers need only some messages', 'SNS filter policy', 'Lọc ở phía SNS, không cần code lọc.'],
    ['load streaming data into S3 without writing code', 'Amazon Data Firehose (Kinesis Data Firehose)', 'Tự gom lô, nén, chuyển đổi và giao dữ liệu.'],
    ['same GET requests hit the backend repeatedly', 'Bật API Gateway caching', 'Cache theo stage, có TTL.'],
    ['high-volume, short-duration workflows', 'Step Functions Express Workflows', 'Standard dành cho luồng dài, cần exactly-once.'],
    ['traces are missing from EC2 or ECS', 'Chạy X-Ray daemon + cấp quyền xray:PutTraceSegments', 'Lambda không cần cài daemon.']
  ]
};
